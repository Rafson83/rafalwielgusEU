import crypto from 'crypto';
import QRCode from 'qrcode';

// Alfabet Base32 (RFC 4648)
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Koduje Buffer do ciągu Base32 bez paddingu '='
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Dekoduje ciąg Base32 do Buffer
 */
export function base32Decode(base32Str: string): Buffer {
  const clean = base32Str.toUpperCase().replace(/[\s=-]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) {
      throw new Error(`Nieprawidłowy znak Base32: ${clean[i]}`);
    }

    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Generuje losowy klucz tajny Base32 (domyślnie 20 bajtów = 32 znaki Base32)
 */
export function generateTotpSecret(lengthBytes = 20): string {
  const randomBytes = crypto.randomBytes(lengthBytes);
  return base32Encode(randomBytes);
}

/**
 * Wylicza 6-cyfrowy kod TOTP dla danego klucza i kroku czasowego (RFC 6238)
 */
export function generateTOTP(secret: string, timeStep?: number): string {
  const step = timeStep !== undefined ? timeStep : Math.floor(Date.now() / 1000 / 30);
  const secretBuffer = base32Decode(secret);

  // 8-bajtowy bufor kroku czasowego w formacie Big-Endian
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(step));

  // HMAC-SHA1
  const hmac = crypto.createHmac('sha1', secretBuffer);
  hmac.update(counterBuffer);
  const digest = hmac.digest();

  // Dynamiczne obcięcie (Dynamic Truncation - RFC 4226)
  const offset = digest[digest.length - 1] & 0x0f;
  const binaryCode =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = binaryCode % 1_000_000;
  return otp.toString().padStart(6, '0');
}

/**
 * Weryfikuje kod TOTP z tolerancją na przesunięcie zegara (okno ±1 krok = ±30s)
 */
export function verifyTOTP(token: string, secret: string, window = 1): boolean {
  if (!token || !secret) return false;
  const cleanToken = token.trim().replace(/\s+/g, '');
  if (!/^\d{6}$/.test(cleanToken)) return false;

  const currentStep = Math.floor(Date.now() / 1000 / 30);

  for (let i = -window; i <= window; i++) {
    const expected = generateTOTP(secret, currentStep + i);
    if (crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expected))) {
      return true;
    }
  }

  return false;
}

/**
 * Tworzy URI zgodne ze standardem Google Authenticator (KeyUriFormat)
 * Zapewnia 100% kompatybilności ASCII (eliminuje polskie znaki i myślniki typograficzne,
 * które powodują awarie parsera w aplikacjach mobilnych).
 */
export function getTotpUri(
  secret: string,
  accountName = 'admin',
  issuer = 'RafalWielgus'
): string {
  const cleanIssuer = issuer
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '') || 'RafalWielgus';

  const cleanAccount = accountName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9.@_-]/g, '') || 'admin';

  return `otpauth://totp/${cleanIssuer}:${cleanAccount}?secret=${secret}&issuer=${cleanIssuer}`;
}

/**
 * Generuje kod QR jako Data URL (PNG) do wyświetlenia w przeglądarce
 */
export async function generateQrCodeDataUrl(totpUri: string): Promise<string> {
  return QRCode.toDataURL(totpUri, {
    width: 320,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
  });
}

/**
 * Generuje jednorazowe kody zapasowe (Recovery Codes)
 */
export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 znaków np. A1B2-C3D4
    const formatted = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    codes.push(formatted);
  }
  return codes;
}

/**
 * Haszuje kod zapasowy do bezpiecznego zapisu (SHA-256)
 */
export function hashBackupCode(code: string): string {
  const clean = code.trim().replace(/[-\s]/g, '').toUpperCase();
  return crypto.createHash('sha256').update(clean).digest('hex');
}
