import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/posts - pobierz listę opublikowanych postów
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// POST /api/posts - dodaj nowy post (tymczasowo bez zabezpieczeń, dodamy je w panelu admina)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, category, published } = body;

    if (!title || !slug || !content || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        category,
        published: !!published,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
