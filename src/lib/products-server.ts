import fs from 'fs/promises';
import path from 'path';
import { PRODUCTS, Product, ProductStatus } from './products';
import { db } from './db';
import { RowDataPacket } from 'mysql2';

const DATA_DIR = path.join(process.cwd(), 'data');
const OVERRIDE_FILE = path.join(DATA_DIR, 'products_override.json');

export interface ProductOverride {
  status?: ProductStatus;
  statusLabel?: string;
  price?: string;
  priceNote?: string;
  title?: string;
  headline?: string;
  tagline?: string;
  description?: string;
  badge?: string;
  category?: 'Kurs & Warsztat' | 'Szablon & Narzędzie' | 'E-book & Przewodnik';
}

// Odczyt nadpisań z pliku JSON
async function readOverridesFromFile(): Promise<Record<string, ProductOverride>> {
  try {
    const data = await fs.readFile(OVERRIDE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Zapis nadpisań do pliku JSON
async function writeOverridesToFile(overrides: Record<string, ProductOverride>): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(OVERRIDE_FILE, JSON.stringify(overrides, null, 2), 'utf-8');
  } catch (err) {
    console.error('Błąd zapisu products_override.json:', err);
  }
}

// Opcjonalna synchronizacja z bazą MySQL (jeśli jest skonfigurowana)
async function getDbOverrides(): Promise<Record<string, ProductOverride>> {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS product_overrides (
        slug VARCHAR(100) PRIMARY KEY,
        status VARCHAR(50) NOT NULL,
        statusLabel VARCHAR(255),
        price VARCHAR(100),
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [rows] = await db.query<RowDataPacket[]>('SELECT slug, status, statusLabel, price FROM product_overrides');
    const result: Record<string, ProductOverride> = {};
    for (const row of rows) {
      result[row.slug] = {
        status: row.status as ProductStatus,
        statusLabel: row.statusLabel,
        price: row.price,
      };
    }
    return result;
  } catch {
    return {};
  }
}

export async function getEffectiveProducts(includeDrafts = false): Promise<Product[]> {
  const fileOverrides = await readOverridesFromFile();
  const dbOverrides = await getDbOverrides();
  const overrides = { ...fileOverrides, ...dbOverrides };

  const merged = PRODUCTS.map((prod) => {
    const override = overrides[prod.slug];
    if (!override) return prod;

    const newStatus = override.status || prod.status;
    const isNowDraft = newStatus === 'Szkic';

    return {
      ...prod,
      title: override.title || prod.title,
      headline: override.headline || prod.headline,
      tagline: override.tagline || prod.tagline,
      description: override.description || prod.description,
      status: newStatus,
      statusLabel: override.statusLabel || prod.statusLabel,
      price: override.price || prod.price,
      priceNote: override.priceNote !== undefined ? override.priceNote : prod.priceNote,
      badge: override.badge || prod.badge,
      category: override.category || prod.category,
      isDraft: isNowDraft,
    };
  });

  if (includeDrafts) {
    return merged;
  }

  return merged.filter((p) => !p.isDraft && p.status !== 'Szkic');
}

export async function updateProductOverride(
  slug: string,
  updatesOrStatus: Partial<ProductOverride> | ProductStatus,
  maybeStatusLabel?: string
): Promise<Product | null> {
  const fileOverrides = await readOverridesFromFile();
  const currentOverride = fileOverrides[slug] || {};

  let updates: Partial<ProductOverride> = {};
  if (typeof updatesOrStatus === 'string') {
    updates = {
      status: updatesOrStatus as ProductStatus,
      statusLabel: maybeStatusLabel,
    };
  } else {
    updates = updatesOrStatus;
  }

  const newStatus = updates.status || currentOverride.status;
  let statusLabel = updates.statusLabel || currentOverride.statusLabel;
  if (newStatus && !statusLabel) {
    if (newStatus === 'Zapowiedź') statusLabel = 'Zapowiedź — Zapisy na listę startową';
    else if (newStatus === 'W przygotowaniu') statusLabel = 'W przygotowaniu — Zapisy na listę startową';
    else if (newStatus === 'Szkic') statusLabel = 'Szkic roboczy — Wewnętrzny szkic projektowy';
  }

  fileOverrides[slug] = {
    ...currentOverride,
    ...updates,
    ...(newStatus ? { status: newStatus } : {}),
    ...(statusLabel ? { statusLabel } : {}),
  };

  await writeOverridesToFile(fileOverrides);

  // Zapis do MySQL jeśli baza jest aktywna
  if (newStatus) {
    try {
      await db.query(
        `INSERT INTO product_overrides (slug, status, statusLabel, price)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status), statusLabel = VALUES(statusLabel), price = VALUES(price)`,
        [slug, newStatus, statusLabel || null, updates.price || currentOverride.price || null]
      );
    } catch {
      // Ignorujemy brak bazy w środowisku lokalnym/statycznym
    }
  }

  const all = await getEffectiveProducts(true);
  return all.find((p) => p.slug === slug) || null;
}
