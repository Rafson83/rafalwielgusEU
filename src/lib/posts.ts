import { db } from '@/lib/db';

export async function ensurePostsTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      tags TEXT NULL,
      seoTitle VARCHAR(255) NULL,
      seoDescription TEXT NULL,
      thumbnailUrl VARCHAR(500) NULL,
      published BOOLEAN DEFAULT FALSE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      publishedAt TIMESTAMP NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const columns = [
    ['tags', 'TEXT NULL'],
    ['seoTitle', 'VARCHAR(255) NULL'],
    ['seoDescription', 'TEXT NULL'],
    ['thumbnailUrl', 'VARCHAR(500) NULL'],
  ];

  for (const [name, definition] of columns) {
    try {
      await db.query(`ALTER TABLE posts ADD COLUMN ${name} ${definition}`);
    } catch (error: unknown) {
      const errorCode = typeof error === 'object' && error !== null && 'code' in error
        ? error.code
        : undefined;
      if (errorCode !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
    }
  }
}
