import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { db } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Subscriber {
  id?: number;
  email: string;
  token: string;
  status: 'pending' | 'active' | 'unsubscribed';
  createdAt: string;
  confirmedAt?: string | null;
  unsubscribedAt?: string | null;
}

const FALLBACK_DATA_DIR = path.join(process.cwd(), 'data');
const FALLBACK_FILE_PATH = path.join(FALLBACK_DATA_DIR, 'subscribers.json');

// Pomocniczy odczyt z magazynu lokalnego (fallback gdy brak MySQL)
async function readFallbackSubscribers(): Promise<Subscriber[]> {
  try {
    const data = await fs.readFile(FALLBACK_FILE_PATH, 'utf-8');
    return JSON.parse(data) as Subscriber[];
  } catch {
    return [];
  }
}

// Pomocniczy zapis do magazynu lokalnego
async function writeFallbackSubscribers(subscribers: Subscriber[]): Promise<void> {
  try {
    await fs.mkdir(FALLBACK_DATA_DIR, { recursive: true });
    await fs.writeFile(FALLBACK_FILE_PATH, JSON.stringify(subscribers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Błąd zapisu pliku fallback dla subskrybentów:', err);
  }
}

// Automatyczne tworzenie tabeli w bazie MySQL
export async function ensureSubscribersTable(): Promise<boolean> {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        token VARCHAR(128) NOT NULL UNIQUE,
        status ENUM('pending', 'active', 'unsubscribed') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        confirmedAt TIMESTAMP NULL,
        unsubscribedAt TIMESTAMP NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    return true;
  } catch (err) {
    console.warn('Baza MySQL niedostępna. Używanie lokalnego magazynu subskrypcji (fallback):', err);
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Zapis nowego adresu na newsletter.
 * Generuje token aktywacyjny (Double Opt-In).
 */
export async function subscribeEmail(rawEmail: string): Promise<{
  success: boolean;
  token: string;
  alreadyActive: boolean;
  email: string;
}> {
  const email = rawEmail.trim().toLowerCase();
  if (!isValidEmail(email)) {
    throw new Error('Niepoprawny format adresu e-mail.');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const hasDb = await ensureSubscribersTable();

  if (hasDb) {
    try {
      // Sprawdzamy czy użytkownik już istnieje
      const [existing] = await db.query<RowDataPacket[]>(
        'SELECT * FROM newsletter_subscribers WHERE email = ? LIMIT 1',
        [email]
      );

      if (existing && existing.length > 0) {
        const sub = existing[0] as Subscriber;
        if (sub.status === 'active') {
          return { success: true, token: sub.token, alreadyActive: true, email };
        }
        // Jeśli był pending lub unsubscribed, odświeżamy token
        await db.query(
          'UPDATE newsletter_subscribers SET token = ?, status = "pending" WHERE email = ?',
          [token, email]
        );
        return { success: true, token, alreadyActive: false, email };
      }

      // Nowy rekord
      await db.query<ResultSetHeader>(
        'INSERT INTO newsletter_subscribers (email, token, status) VALUES (?, ?, "pending")',
        [email, token]
      );

      return { success: true, token, alreadyActive: false, email };
    } catch (dbErr) {
      console.warn('Błąd zapytania MySQL, przełączanie na fallback:', dbErr);
    }
  }

  // Fallback lokalny (JSON)
  const subscribers = await readFallbackSubscribers();
  const existingIndex = subscribers.findIndex((s) => s.email === email);

  if (existingIndex >= 0) {
    const sub = subscribers[existingIndex];
    if (sub.status === 'active') {
      return { success: true, token: sub.token, alreadyActive: true, email };
    }
    sub.token = token;
    sub.status = 'pending';
    await writeFallbackSubscribers(subscribers);
    return { success: true, token, alreadyActive: false, email };
  }

  subscribers.push({
    email,
    token,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  await writeFallbackSubscribers(subscribers);

  return { success: true, token, alreadyActive: false, email };
}

/**
 * Potwierdzenie subskrypcji przez token z maila (Double Opt-In)
 */
export async function confirmSubscription(token: string): Promise<{
  success: boolean;
  message: string;
  email?: string;
}> {
  if (!token || typeof token !== 'string') {
    return { success: false, message: 'Brak lub nieprawidłowy token aktywacyjny.' };
  }

  const hasDb = await ensureSubscribersTable();

  if (hasDb) {
    try {
      const [rows] = await db.query<RowDataPacket[]>(
        'SELECT * FROM newsletter_subscribers WHERE token = ? LIMIT 1',
        [token]
      );

      if (rows && rows.length > 0) {
        const sub = rows[0] as Subscriber;
        if (sub.status === 'active') {
          return { success: true, message: 'Subskrypcja została już wcześniej potwierdzona.', email: sub.email };
        }

        await db.query(
          'UPDATE newsletter_subscribers SET status = "active", confirmedAt = NOW() WHERE token = ?',
          [token]
        );
        return { success: true, message: 'Adres e-mail został pomyślnie potwierdzony.', email: sub.email };
      }
    } catch (dbErr) {
      console.warn('Błąd potwierdzenia w MySQL, sprawdzanie fallbacku:', dbErr);
    }
  }

  // Fallback lokalny
  const subscribers = await readFallbackSubscribers();
  const sub = subscribers.find((s) => s.token === token);

  if (!sub) {
    return { success: false, message: 'Nie znaleziono subskrypcji dla podanego tokenu.' };
  }

  if (sub.status === 'active') {
    return { success: true, message: 'Subskrypcja została już wcześniej potwierdzona.', email: sub.email };
  }

  sub.status = 'active';
  sub.confirmedAt = new Date().toISOString();
  await writeFallbackSubscribers(subscribers);

  return { success: true, message: 'Adres e-mail został pomyślnie potwierdzony.', email: sub.email };
}

/**
 * Rezygnacja z newslettera (wypisanie)
 */
export async function unsubscribeEmail(token: string): Promise<{
  success: boolean;
  message: string;
}> {
  if (!token) {
    return { success: false, message: 'Brak tokenu wypisania.' };
  }

  const hasDb = await ensureSubscribersTable();

  if (hasDb) {
    try {
      const [result] = await db.query<ResultSetHeader>(
        'UPDATE newsletter_subscribers SET status = "unsubscribed", unsubscribedAt = NOW() WHERE token = ?',
        [token]
      );
      if (result.affectedRows > 0) {
        return { success: true, message: 'Zostałeś pomyślnie wypisany z newslettera.' };
      }
    } catch (dbErr) {
      console.warn('Błąd wypisania w MySQL, sprawdzanie fallbacku:', dbErr);
    }
  }

  const subscribers = await readFallbackSubscribers();
  const sub = subscribers.find((s) => s.token === token);
  if (sub) {
    sub.status = 'unsubscribed';
    sub.unsubscribedAt = new Date().toISOString();
    await writeFallbackSubscribers(subscribers);
    return { success: true, message: 'Zostałeś pomyślnie wypisany z newslettera.' };
  }

  return { success: false, message: 'Nie odnaleziono subskrybenta dla podanego tokenu.' };
}
