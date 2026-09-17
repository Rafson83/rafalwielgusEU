import { NextResponse } from 'next/server';
import { getEffectiveProducts, updateProductOverride } from '@/lib/products-server';
import { ProductStatus } from '@/lib/products';

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

// PATCH /api/products - zmiana statusu produktu (np. publikacja szkicu do "W przygotowaniu")
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { slug, status, statusLabel } = body;

    if (!slug || !status) {
      return NextResponse.json({ error: 'Brak wymaganych pól: slug i status' }, { status: 400 });
    }

    const updated = await updateProductOverride(slug, status as ProductStatus, statusLabel);
    if (!updated) {
      return NextResponse.json({ error: 'Produkt nie został znaleziony' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Błąd aktualizacji statusu produktu:', error);
    return NextResponse.json({ error: 'Błąd zapisu' }, { status: 500 });
  }
}
