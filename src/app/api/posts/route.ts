import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensurePostsTable } from '@/lib/posts';
import { RowDataPacket } from 'mysql2';

// GET /api/posts - pobierz listę opublikowanych postów
export async function GET() {
  try {
    await ensurePostsTable();

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
    const { title, slug, content, category, tags, seoTitle, seoDescription, thumbnailUrl, published } = body;

    if (!title || !slug || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isPublished = published ? 1 : 0;
    const publishedAt = published ? new Date() : null;

    await ensurePostsTable();

    // Bezpieczne wstawienie rekordu
    await db.query(
      'INSERT INTO posts (title, slug, content, category, tags, seoTitle, seoDescription, thumbnailUrl, published, publishedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, content, category, tags || null, seoTitle || null, seoDescription || null, thumbnailUrl || null, isPublished, publishedAt]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating post:', error);
    const errorCode = typeof error === 'object' && error !== null && 'code' in error
      ? error.code
      : undefined;
    if (errorCode === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
