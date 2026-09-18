import fs from 'fs/promises';
import path from 'path';
import { db } from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'spam';

export interface Comment {
  id: number;
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  status: CommentStatus;
  moderationReason?: string;
  isAuthorReply?: boolean;
  parentId?: number | null;
  createdAt: string;
  updatedAt?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');

// Lista słów i wzorców podlegających automatycznej moderacji
const PROFANITY_PATTERNS = [
  /chuj/i,
  /kurw/i,
  /jeba/i,
  /pierdol/i,
  /pizd/i,
  /skurw/i,
  /huj/i,
  /cunt/i,
  /fuck/i,
  /bitch/i,
  /asshole/i,
  /whore/i,
  /szmat/i,
  /debil/i,
  /idiot/i,
];

const SPAM_DOMAIN_PATTERNS = [
  /casino/i,
  /krypto/i,
  /crypto/i,
  /viagra/i,
  /cialis/i,
  /loan/i,
  /pozyczk/i,
  /chwilowk/i,
  /bit\.ly/i,
  /tinyurl\.com/i,
  /t\.co/i,
  /porno/i,
  /xxx/i,
  /onlyfans/i,
  /bet365/i,
  /vulkan/i,
];

/**
 * Silnik automatycznej moderacji tekstu komentarza
 */
export function autoModerateComment(params: {
  content: string;
  authorName: string;
  authorEmail?: string;
  honeypot?: string;
  timeElapsedSeconds?: number;
}): { status: CommentStatus; reason: string } {
  const { content, authorName, honeypot, timeElapsedSeconds } = params;

  // 1. Zabezpieczenie Honeypot (boty wypełniają ukryte pola)
  if (honeypot && honeypot.trim().length > 0) {
    return {
      status: 'spam',
      reason: 'Wykryto bota (wypełniono ukryte pole pułapki)',
    };
  }

  // 2. Test minimalnego czasu wypełnienia formularza
  if (timeElapsedSeconds !== undefined && timeElapsedSeconds < 2) {
    return {
      status: 'spam',
      reason: 'Zbyt szybkie przesłanie formularza (< 2s)',
    };
  }

  const cleanContent = content.trim();
  const cleanName = authorName.trim();

  // 3. Walidacja długości
  if (cleanContent.length < 3) {
    return {
      status: 'rejected',
      reason: 'Treść komentarza jest zbyt krótka (min. 3 znaki)',
    };
  }

  if (cleanContent.length > 3000) {
    return {
      status: 'rejected',
      reason: 'Treść komentarza przekracza limit 3000 znaków',
    };
  }

  // 4. Filtr wulgaryzmów i hejtu
  const combinedText = `${cleanName} ${cleanContent}`;
  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(combinedText)) {
      return {
        status: 'rejected',
        reason: 'Wykryto słowa wulgarne lub obraźliwe',
      };
    }
  }

  // 5. Analiza linków i domen spamowych
  for (const pattern of SPAM_DOMAIN_PATTERNS) {
    if (pattern.test(cleanContent)) {
      return {
        status: 'spam',
        reason: 'Wykryto podejrzany link lub frazę spamową',
      };
    }
  }

  const urlMatches = cleanContent.match(/https?:\/\/[^\s]+|www\.[^\s]+/gi) || [];
  if (urlMatches.length > 1) {
    return {
      status: 'pending',
      reason: 'Wymaga weryfikacji: komentarz zawiera wiele odnośników',
    };
  }

  if (urlMatches.length === 1) {
    return {
      status: 'pending',
      reason: 'Wymaga weryfikacji: komentarz zawiera odnośnik zewnętrzny',
    };
  }

  // 6. Podejrzanie długie ciągi wielkich liter (krzyk)
  const lettersOnly = cleanContent.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, '');
  if (lettersOnly.length > 20) {
    const uppercaseLetters = cleanContent.replace(/[^A-ZĄĆĘŁŃÓŚŹŻ]/g, '');
    if (uppercaseLetters.length / lettersOnly.length > 0.7) {
      return {
        status: 'pending',
        reason: 'Wymaga weryfikacji: nadmierne użycie wielkich liter',
      };
    }
  }

  // 7. Wszystko czyste - automatyczna akceptacja
  return {
    status: 'approved',
    reason: 'Zatwierdzony automatycznie (czysta treść, brak spamu)',
  };
}

let commentsTableInitialized = false;

export async function ensureCommentsTable(): Promise<void> {
  if (commentsTableInitialized) return;

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        postSlug VARCHAR(255) NOT NULL,
        authorName VARCHAR(100) NOT NULL,
        authorEmail VARCHAR(255) NULL,
        content TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        moderationReason VARCHAR(255) NULL,
        isAuthorReply BOOLEAN DEFAULT FALSE,
        parentId INT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_post_slug (postSlug),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    commentsTableInitialized = true;
  } catch (err) {
    console.warn('MySQL nieosiągalny dla comments, używam fallbacku JSON:', err);
    commentsTableInitialized = true;
  }
}

async function readJsonComments(): Promise<Comment[]> {
  try {
    const data = await fs.readFile(COMMENTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJsonComments(comments: Comment[]): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8');
  } catch (err) {
    console.error('Błąd zapisu pliku comments.json:', err);
  }
}

/**
 * Pobierz publicznie zatwierdzone komentarze dla danego artykułu
 */
export async function getApprovedComments(postSlug: string): Promise<Comment[]> {
  await ensureCommentsTable();

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM comments WHERE postSlug = ? AND status = "approved" ORDER BY createdAt ASC',
      [postSlug]
    );
    if (rows && rows.length > 0) {
      return rows as Comment[];
    }
  } catch {
    // Fallback do JSON
  }

  const fileComments = await readJsonComments();
  return fileComments
    .filter((c) => c.postSlug === postSlug && c.status === 'approved')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Pobierz wszystkie komentarze (dla panelu administratora)
 */
export async function getAllCommentsForAdmin(): Promise<Comment[]> {
  await ensureCommentsTable();

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM comments ORDER BY createdAt DESC'
    );
    if (rows && rows.length > 0) {
      return rows as Comment[];
    }
  } catch {
    // Fallback do JSON
  }

  const fileComments = await readJsonComments();
  return fileComments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Dodaj nowy komentarz z automatyczną oceną moderacyjną
 */
export async function addComment(params: {
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  honeypot?: string;
  timeElapsedSeconds?: number;
  parentId?: number | null;
  isAuthorReply?: boolean;
}): Promise<Comment> {
  await ensureCommentsTable();

  const { postSlug, authorName, authorEmail, content, honeypot, timeElapsedSeconds, parentId, isAuthorReply } = params;

  // Jeśli komentarz pisze bezpośrednio autor z panelu admina
  let status: CommentStatus = 'approved';
  let moderationReason = 'Wpis autora bloga';

  if (!isAuthorReply) {
    const moderation = autoModerateComment({
      content,
      authorName,
      authorEmail,
      honeypot,
      timeElapsedSeconds,
    });
    status = moderation.status;
    moderationReason = moderation.reason;
  }

  const now = new Date().toISOString();
  let newId = Date.now();

  const newComment: Comment = {
    id: newId,
    postSlug,
    authorName: cleanString(authorName, 100),
    authorEmail: authorEmail ? cleanString(authorEmail, 255) : undefined,
    content: cleanString(content, 3000),
    status,
    moderationReason,
    isAuthorReply: Boolean(isAuthorReply),
    parentId: parentId || null,
    createdAt: now,
    updatedAt: now,
  };

  // Zapis do MySQL jeśli dostępna
  try {
    const [result] = await db.query<ResultSetHeader>(
      `INSERT INTO comments (postSlug, authorName, authorEmail, content, status, moderationReason, isAuthorReply, parentId, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newComment.postSlug,
        newComment.authorName,
        newComment.authorEmail || null,
        newComment.content,
        newComment.status,
        newComment.moderationReason || null,
        newComment.isAuthorReply ? 1 : 0,
        newComment.parentId || null,
        newComment.createdAt,
      ]
    );
    if (result && result.insertId) {
      newComment.id = result.insertId;
    }
  } catch {
    // Kontynuuj z fallbackiem JSON
  }

  // Zapis w pliku JSON jako trwały magazyn / kopia
  const allJson = await readJsonComments();
  allJson.push(newComment);
  await writeJsonComments(allJson);

  return newComment;
}

/**
 * Zmień status komentarza (np. zatwierdź, oznacz jako spam)
 */
export async function updateCommentStatus(
  id: number,
  status: CommentStatus
): Promise<Comment | null> {
  await ensureCommentsTable();

  const now = new Date().toISOString();

  // MySQL
  try {
    await db.query(
      'UPDATE comments SET status = ?, updatedAt = ? WHERE id = ?',
      [status, now, id]
    );
  } catch {
    // fallback
  }

  // JSON
  const allJson = await readJsonComments();
  const index = allJson.findIndex((c) => c.id === id);
  if (index !== -1) {
    allJson[index].status = status;
    allJson[index].updatedAt = now;
    await writeJsonComments(allJson);
    return allJson[index];
  }

  return null;
}

/**
 * Usuń komentarz
 */
export async function deleteComment(id: number): Promise<boolean> {
  await ensureCommentsTable();

  // MySQL
  try {
    await db.query('DELETE FROM comments WHERE id = ?', [id]);
  } catch {
    // fallback
  }

  // JSON
  const allJson = await readJsonComments();
  const filtered = allJson.filter((c) => c.id !== id);
  await writeJsonComments(filtered);

  return true;
}

/**
 * Odpowiedź autora z poziomu panelu administratora
 */
export async function replyAsAuthor(params: {
  parentId: number;
  postSlug: string;
  content: string;
}): Promise<Comment> {
  return addComment({
    postSlug: params.postSlug,
    authorName: 'Rafał Wielgus',
    authorEmail: 'hello@rafalwielgus.eu',
    content: params.content,
    parentId: params.parentId,
    isAuthorReply: true,
  });
}

function cleanString(str: string, maxLength: number): string {
  return str.trim().slice(0, maxLength);
}
