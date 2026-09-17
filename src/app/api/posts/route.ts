import { NextResponse } from 'next/server';
import {
  getAllPostsForAdmin,
  getEffectivePublicPosts,
  createNewPost,
  updatePostStatus,
  updatePost,
} from '@/lib/posts-server';

// GET /api/posts - pobierz listę artykułów
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true' || searchParams.get('all') === 'true';
    const simulatedDateParam = searchParams.get('simulatedDate');
    const referenceDate = simulatedDateParam ? new Date(simulatedDateParam) : new Date();

    if (isAdmin) {
      const allPosts = await getAllPostsForAdmin(referenceDate);
      return NextResponse.json(allPosts);
    }

    const includeScheduled = searchParams.get('includeScheduled') === 'true';
    const posts = await getEffectivePublicPosts({
      includeScheduled,
      referenceDate,
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Błąd pobierania postów:', error);
    return NextResponse.json({ error: 'Nie udało się pobrać artykułów' }, { status: 500 });
  }
}

// POST /api/posts - dodaj nowy post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, category, tags, seoTitle, seoDescription, thumbnailUrl, status, scheduledDate } = body;

    if (!title || !slug || !content || !category) {
      return NextResponse.json({ error: 'Wypełnij wymagane pola (tytuł, slug, kategoria, treść)' }, { status: 400 });
    }

    const created = await createNewPost({
      title,
      slug,
      content,
      category,
      tags,
      seoTitle,
      seoDescription,
      thumbnailUrl,
      status: status || 'draft',
      scheduledDate,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Błąd tworzenia posta:', error);
    return NextResponse.json({ error: 'Błąd podczas tworzenia artykułu' }, { status: 500 });
  }
}

// PUT /api/posts - pełna edycja artykułu (tytuł, treść, kategoria, tagi, slug, seo, status)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      originalSlug,
      slug,
      title,
      content,
      category,
      tags,
      seoTitle,
      seoDescription,
      thumbnailUrl,
      status,
      scheduledDate,
    } = body;

    const postSlug = originalSlug || slug;
    if (!postSlug) {
      return NextResponse.json({ error: 'Brak identyfikatora posta (slug)' }, { status: 400 });
    }

    if (!title || !content || !category) {
      return NextResponse.json({ error: 'Wypełnij wymagane pola (tytuł, kategoria, treść)' }, { status: 400 });
    }

    const updated = await updatePost(postSlug, {
      title,
      newSlug: slug,
      content,
      category,
      tags,
      seoTitle,
      seoDescription,
      thumbnailUrl,
      status: status || 'draft',
      scheduledDate,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Artykuł nie został odnaleziony' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error('Błąd aktualizacji posta:', error);
    return NextResponse.json({ error: 'Nie udało się zaktualizować artykułu' }, { status: 500 });
  }
}

// PATCH /api/posts - szybka zmiana statusu lub daty artykułu (Szkic / Zapowiedź / Publikacja)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { slug, status, scheduledDate } = body;

    if (!slug || !status) {
      return NextResponse.json({ error: 'Brak pól slug i status' }, { status: 400 });
    }

    const updated = await updatePostStatus(slug, status, scheduledDate);
    if (!updated) {
      return NextResponse.json({ error: 'Artykuł nie został odnaleziony' }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    console.error('Błąd aktualizacji posta:', error);
    return NextResponse.json({ error: 'Nie udało się zaktualizować artykułu' }, { status: 500 });
  }
}
