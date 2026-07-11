import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET /api/posts - pobierz listę opublikowanych postów
export async function GET() {
  try {
    // Automatycznie sprawdzamy i tworzymy tabelę posts, jeśli nie istnieje
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        published BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        publishedAt TIMESTAMP NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM posts WHERE published = 1 ORDER BY createdAt DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/posts - dodaj nowy post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, category, published } = body;

    if (!title || !slug || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isPublished = published ? 1 : 0;
    const publishedAt = published ? new Date() : null;

    // Bezpieczne wstawienie rekordu
    await db.query(
      'INSERT INTO posts (title, slug, content, category, published, publishedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [title, slug, content, category, isPublished, publishedAt]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
