import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-change-me-in-env';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Zabezpieczenie ścieżek panelu administratora oraz metod modyfikujących API (POST, PUT, DELETE)
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isModifyApiRoute = pathname.startsWith('/api/') && 
                           !pathname.startsWith('/api/auth') && 
                           request.method !== 'GET';

  if (isAdminRoute || isModifyApiRoute) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Weryfikacja tokenu JWT
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware JWT Verification Failed:', error);
      if (isAdminRoute) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// Konfiguracja ścieżek, które ma przechwytywać middleware
export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
