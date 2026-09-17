import fs from 'fs/promises';
import path from 'path';
import { PRODUCTS, Product, ProductStatus } from './products';
import { db } from './db';
import { RowDataPacket } from 'mysql2';

const DATA_DIR = path.join(process.cwd(), 'data');
const OVERRIDE_FILE = path.join(DATA_DIR, 'products_override.json');

export interface ProductOverride {
  status: ProductStatus;
  statusLabel?: string;
  price?: string;
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
      status: newStatus,
      statusLabel: override.statusLabel || prod.statusLabel,
      price: override.price || prod.price,
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
  newStatus: ProductStatus,
  statusLabel?: string
): Promise<Product | null> {
  const fileOverrides = await readOverridesFromFile();
  const currentOverride = fileOverrides[slug] || {};

  fileOverrides[slug] = {
    ...currentOverride,
    status: newStatus,
    statusLabel:
      statusLabel ||
      (newStatus === 'Zapowiedź'
        ? 'Zapowiedź — Zapisy na listę startową'
        : newStatus === 'W przygotowaniu'
        ? 'W przygotowaniu — Zapisy na listę startową'
        : newStatus === 'Szkic'
        ? 'Szkic roboczy — Wewnętrzny szkic projektowy'
        : undefined),
  };

  await writeOverridesToFile(fileOverrides);

  // Zapis do MySQL jeśli baza jest aktywna
  try {
    await db.query(
      `INSERT INTO product_overrides (slug, status, statusLabel)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status = VALUES(status), statusLabel = VALUES(statusLabel)`,
      [slug, newStatus, statusLabel || null]
    );
  } catch {
    // Ignorujemy brak bazy w środowisku lokalnym/statycznym
  }

  const all = await getEffectiveProducts(true);
  return all.find((p) => p.slug === slug) || null;
}
