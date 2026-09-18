import { NextRequest, NextResponse } from 'next/server';
import {
  updateCommentStatus,
  deleteComment,
  replyAsAuthor,
  CommentStatus,
} from '@/lib/comments-server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/comments/[id] - zmiana statusu moderacyjnego
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Nieprawidłowe ID komentarza' }, { status: 400 });
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses: CommentStatus[] = ['pending', 'approved', 'rejected', 'spam'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy status. Dozwolone: pending, approved, rejected, spam' },
        { status: 400 }
      );
    }

    const updated = await updateCommentStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Nie znaleziono komentarza' }, { status: 404 });
    }

    return NextResponse.json({ success: true, comment: updated });
  } catch (error) {
    console.error('Błąd aktualizacji statusu komentarza:', error);
    return NextResponse.json(
      { error: 'Błąd serwera podczas aktualizacji komentarza' },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - usunięcie komentarza
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Nieprawidłowe ID komentarza' }, { status: 400 });
    }

    const deleted = await deleteComment(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Błąd usuwania komentarza:', error);
    return NextResponse.json(
      { error: 'Błąd serwera podczas usuwania komentarza' },
      { status: 500 }
    );
  }
}

// POST /api/comments/[id] - odpowiedź autora (Rafał Wielgus) na dany komentarz
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: idStr } = await context.params;
    const parentId = parseInt(idStr, 10);
    if (isNaN(parentId)) {
      return NextResponse.json({ error: 'Nieprawidłowe ID komentarza' }, { status: 400 });
    }

    const body = await request.json();
    const { postSlug, content } = body;

    if (!postSlug || !content || !content.trim()) {
      return NextResponse.json(
        { error: 'Wymagane pola: postSlug, content' },
        { status: 400 }
      );
    }

    const reply = await replyAsAuthor({
      parentId,
      postSlug,
      content: content.trim(),
    });

    return NextResponse.json({ success: true, reply }, { status: 201 });
  } catch (error) {
    console.error('Błąd dodawania odpowiedzi autora:', error);
    return NextResponse.json(
      { error: 'Błąd serwera podczas dodawania odpowiedzi' },
      { status: 500 }
    );
  }
}
