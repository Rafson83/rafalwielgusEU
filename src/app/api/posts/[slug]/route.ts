import { NextRequest, NextResponse } from 'next/server';
import { getEffectivePostBySlug } from '@/lib/posts-server';
import { getPostBySlug } from '@/lib/posts';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const isPreview = searchParams.get('preview') === 'true' || searchParams.get('admin') === 'true';
    const simulatedDateParam = searchParams.get('simulatedDate');
    const referenceDate = simulatedDateParam
      ? new Date(simulatedDateParam)
      : new Date();

    // Pobranie z serwera z uwzględnieniem custom_posts i posts_override
    const effectivePost = await getEffectivePostBySlug(slug, { referenceDate, isPreview });
    if (effectivePost) {
      return NextResponse.json(effectivePost);
    }

    // Fallback do standardowej biblioteki posts
    const post = await getPostBySlug(slug, { referenceDate });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}
