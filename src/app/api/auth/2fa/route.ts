import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  getTwoFactorStatus,
  activateTwoFactor,
  disableTwoFactor,
} from '@/lib/auth-2fa';
import {
  generateTotpSecret,
  getTotpUri,
  generateQrCodeDataUrl,
  generateBackupCodes,
  verifyTOTP,
} from '@/lib/totp';

const ADMIN_PASSWORD_HASH =
  process.env.ADMIN_PASSWORD_HASH ||
  '$2b$10$bsZQMTrxD8MuCfUEAJynye/w9jRUC.GCKlVbz.3MQCE8Iv3kuceYi';

export const dynamic = 'force-dynamic';

// GET /api/auth/2fa - Pobierz aktualny status 2FA
export async function GET() {
  try {
    const status = await getTwoFactorStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error('Błąd pobierania statusu 2FA:', error);
    return NextResponse.json({ error: 'Nie udało się pobrać statusu 2FA' }, { status: 500 });
  }
}

// POST /api/auth/2fa - Rozpocznij procedurę konfiguracji nowego 2FA
export async function POST() {
  try {
    const secret = generateTotpSecret(20);
    const totpUri = getTotpUri(secret, 'admin@rafalwielgus.eu', 'Rafał Wielgus — Panel');
    const qrCodeDataUrl = await generateQrCodeDataUrl(totpUri);
    const backupCodes = generateBackupCodes(8);

    return NextResponse.json({
      secret,
      totpUri,
      qrCodeDataUrl,
      backupCodes,
    });
  } catch (error) {
    console.error('Błąd generowania 2FA:', error);
    return NextResponse.json({ error: 'Nie udało się wygenerować konfiguracji 2FA' }, { status: 500 });
  }
}

// PUT /api/auth/2fa - Potwierdź i aktywuj 2FA po zeskanowaniu i wpisaniu pierwszego kodu
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { secret, code, backupCodes } = body;

    if (!secret || !code || !backupCodes || !Array.isArray(backupCodes)) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych konfiguracyjnych (klucz, kod weryfikacyjny, kody zapasowe)' },
        { status: 400 }
      );
    }

    // Sprawdź czy kod wpisany przez użytkownika pasuje do generowanego sekretu
    const isValid = verifyTOTP(code, secret);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Nieprawidłowy kod weryfikacyjny z aplikacji Authenticator. Sprawdź czas w telefonie i spróbuj ponownie.' },
        { status: 400 }
      );
    }

    // Aktywuj 2FA i zapisz konfigurację
    await activateTwoFactor(secret, backupCodes);

    return NextResponse.json({
      success: true,
      message: 'Logowanie dwuskładnikowe 2FA zostało pomyślnie aktywowane!',
    });
  } catch (error) {
    console.error('Błąd aktywacji 2FA:', error);
    return NextResponse.json({ error: 'Nie udało się aktywować 2FA' }, { status: 500 });
  }
}

// DELETE /api/auth/2fa - Wyłącz 2FA (wymaga podania aktualnego hasła admina)
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Podaj hasło administratora, aby wyłączyć 2FA' }, { status: 400 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Nieprawidłowe hasło' }, { status: 401 });
    }

    await disableTwoFactor();

    return NextResponse.json({
      success: true,
      message: 'Logowanie dwuskładnikowe 2FA zostało wyłączone.',
    });
  } catch (error) {
    console.error('Błąd wyłączania 2FA:', error);
    return NextResponse.json({ error: 'Nie udało się wyłączyć 2FA' }, { status: 500 });
  }
}
