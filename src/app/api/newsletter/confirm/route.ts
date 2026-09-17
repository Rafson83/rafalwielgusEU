import { NextRequest, NextResponse } from 'next/server';
import { confirmSubscription } from '@/lib/newsletter';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(
      new URL('/newsletter/potwierdzenie?status=missing_token', request.url)
    );
  }

  const result = await confirmSubscription(token);

  if (!result.success) {
    return NextResponse.redirect(
      new URL('/newsletter/potwierdzenie?status=invalid', request.url)
    );
  }

  return NextResponse.redirect(
    new URL('/newsletter/potwierdzenie?status=success', request.url)
  );
}
