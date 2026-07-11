import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-change-me-in-env';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$bsZQMTrxD8MuCfUEAJynye/w9jRUC.GCKlVbz.3MQCE8Iv3kuceYi'; // Domyślne: "admin123"

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // Porównanie hasła
    const isPasswordCorrect = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Tworzenie tokenu JWT ważnego 7 dni
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(JWT_SECRET));

    // Zwrócenie tokenu w cookie HTTP-Only (bezpiecznym przed JavaScriptem)
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dni
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
