import { NextResponse } from 'next/server';
import { getEffectiveProducts, updateProductOverride } from '@/lib/products-server';

// GET /api/products - pobierz listę produktów (w panelu admina z draftami, publicznie bez)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get('includeDrafts') === 'true' || searchParams.get('all') === 'true';

    const products = await getEffectiveProducts(includeDrafts);
    return NextResponse.json(products);
  } catch (error) {
    console.error('Błąd pobierania produktów:', error);
    return NextResponse.json({ error: 'Nie udało się pobrać produktów' }, { status: 500 });
  }
}

// PATCH /api/products - aktualizacja produktu (status, tytuł, opis, cena, itp.)
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      slug,
      status,
      statusLabel,
      title,
      headline,
      tagline,
      description,
      price,
      priceNote,
      badge,
      category,
    } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Brak wymaganego pola: slug' }, { status: 400 });
    }

    const updated = await updateProductOverride(slug, {
      status,
      statusLabel,
      title,
      headline,
      tagline,
      description,
      price,
      priceNote,
      badge,
      category,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Produkt nie został znaleziony' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Błąd aktualizacji produktu:', error);
    return NextResponse.json({ error: 'Błąd zapisu' }, { status: 500 });
  }
}
