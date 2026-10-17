import { NextResponse } from 'next/server';
import { submitToIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    let urls: string[] | undefined;
    try {
      const body = await request.json();
      if (body?.urls && Array.isArray(body.urls)) {
        urls = body.urls;
      }
    } catch {
      // Puste body lub wywołanie bez parametrów zgłasza domyślnie wszystkie opublikowane strony
    }

    const result = await submitToIndexNow(urls);
    return NextResponse.json(result, { status: result.success ? 200 : 502 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Błąd przetwarzania żądania IndexNow', error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  const result = await submitToIndexNow();
  return NextResponse.json(result, { status: result.success ? 200 : 502 });
}
