import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ensurePostsTable, getPublishedPosts } from '@/lib/posts';

// GET /api/posts - pobierz listę opublikowanych lub zaplanowanych postów
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeScheduled =
      searchParams.get('includeScheduled') === 'true' ||
      searchParams.get('all') === 'true';
    const simulatedDateParam = searchParams.get('simulatedDate');
    const referenceDate = simulatedDateParam
      ? new Date(simulatedDateParam)
      : new Date();

    const posts = await getPublishedPosts({
      includeScheduled,
      referenceDate,
    });
    return NextResponse.json(posts);
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
