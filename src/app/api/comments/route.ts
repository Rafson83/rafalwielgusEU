import { NextRequest, NextResponse } from 'next/server';
import {
  getApprovedComments,
  getAllCommentsForAdmin,
  addComment,
} from '@/lib/comments-server';

// GET /api/comments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postSlug = searchParams.get('postSlug');
    const isAdmin = searchParams.get('admin') === 'true';

    if (isAdmin) {
      const allComments = await getAllCommentsForAdmin();
      return NextResponse.json(allComments);
    }

    if (!postSlug) {
      return NextResponse.json(
        { error: 'Brak wymaganego parametru postSlug' },
        { status: 400 }
      );
    }

    const approved = await getApprovedComments(postSlug);
    return NextResponse.json(approved);
  } catch (error) {
    console.error('Błąd pobierania komentarzy:', error);
    return NextResponse.json(
      { error: 'Nie udało się pobrać komentarzy' },
      { status: 500 }
    );
  }
}

// POST /api/comments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      postSlug,
      authorName,
      authorEmail,
      content,
      honeypot,
      timeElapsedSeconds,
      parentId,
    } = body;

    if (!postSlug || !authorName || !content) {
      return NextResponse.json(
        { error: 'Wypełnij wymagane pola (postSlug, podpis, treść komentarza)' },
        { status: 400 }
      );
    }

    const newComment = await addComment({
      postSlug,
      authorName,
      authorEmail,
      content,
      honeypot,
      timeElapsedSeconds,
      parentId: parentId ? Number(parentId) : undefined,
    });

    let message = 'Twój komentarz został pomyślnie opublikowany!';
    if (newComment.status === 'pending') {
      message = 'Dziękujemy! Twój komentarz oczekuje na weryfikację moderacyjną.';
    } else if (newComment.status === 'rejected' || newComment.status === 'spam') {
      message = 'Komentarz został automatycznie zatrzymany przez filtr antyspamowy.';
    }

    return NextResponse.json(
      {
        success: true,
        comment: newComment,
        message,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Błąd dodawania komentarza:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas dodawania komentarza' },
      { status: 500 }
    );
  }
}
