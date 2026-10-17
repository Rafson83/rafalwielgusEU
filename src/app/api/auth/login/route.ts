import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { isTwoFactorEnabled, verifyTwoFactorCode } from '@/lib/auth-2fa';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-change-me-in-env';
const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  '$2b$10$bsZQMTrxD8MuCfUEAJynye/w9jRUC.GCKlVbz.3MQCE8Iv3kuceYi'; // Domyślne: "admin123"

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, code, tempToken } = body;

    const twoFactorActive = await isTwoFactorEnabled();

    // =========================================================================
    // KROK 2: Weryfikacja kodu TOTP na podstawie tokenu tymczasowego
    // =========================================================================
    if (tempToken && code) {
      try {
        const { payload } = await jwtVerify(
          tempToken,
          new TextEncoder().encode(JWT_SECRET)
        );

        if (payload.type !== '2fa_challenge') {
          return NextResponse.json(
            { error: 'Nieprawidłowa sesja logowania dwuskładnikowego' },
            { status: 401 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Sesja logowania wygasła. Wprowadź hasło ponownie.' },
          { status: 401 }
        );
      }

      // Weryfikacja kodu z aplikacji Authenticator lub kodu zapasowego
      const verification = await verifyTwoFactorCode(code);
      if (!verification.valid) {
        return NextResponse.json(
          { error: 'Nieprawidłowy kod z aplikacji Authenticator lub kod zapasowy' },
          { status: 401 }
        );
      }

      // Pomyślna weryfikacja 2FA -> wydanie docelowego ciasteczka sesyjnego
      return issueAdminSessionCookie({
        usedBackupCode: verification.method === 'backup',
      });
    }

    // =========================================================================
    // KROK 1: Weryfikacja hasła dostępowego
    // =========================================================================
    if (!password) {
      return NextResponse.json({ error: 'Hasło jest wymagane' }, { status: 400 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Nieprawidłowe hasło' }, { status: 401 });
    }

    // Jeśli 2FA jest włączone i użytkownik nie podał jeszcze kodu TOTP:
    if (twoFactorActive) {
      // Jeśli użytkownik przekazał kod TOTP razem z hasłem (np. z menedżera haseł)
      if (code) {
        const verification = await verifyTwoFactorCode(code);
        if (!verification.valid) {
          return NextResponse.json(
            { error: 'Nieprawidłowy kod z aplikacji Authenticator' },
            { status: 401 }
          );
        }
        return issueAdminSessionCookie({
          usedBackupCode: verification.method === 'backup',
        });
      }

      // Wygeneruj tymczasowy token wyzwania 2FA (ważny 5 minut)
      const challengeToken = await new SignJWT({
        type: '2fa_challenge',
        scope: 'admin',
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('5m')
        .sign(new TextEncoder().encode(JWT_SECRET));

      return NextResponse.json({
        requires2FA: true,
        tempToken: challengeToken,
        message: 'Wprowadź kod z aplikacji Authenticator',
      });
    }

    // Jeśli 2FA nie jest włączone, bezpośrednie logowanie hasłem
    return issueAdminSessionCookie({ twoFactorEnabled: false });
  } catch (error) {
    console.error('Błąd logowania:', error);
    return NextResponse.json({ error: 'Błąd serwera podczas logowania' }, { status: 500 });
  }
}

/**
 * Pomocnicza funkcja tworząca token JWT i ciasteczko sesyjne admin_token
 */
async function issueAdminSessionCookie(extraData?: Record<string, unknown>) {
  const token = await new SignJWT({
    role: 'admin',
    twoFactorVerified: true,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(JWT_SECRET));

  const response = NextResponse.json({
    success: true,
    ...extraData,
  });

  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dni
    path: '/',
  });

  return response;
}
