import fs from 'fs/promises';
import path from 'path';
import { verifyTOTP, hashBackupCode } from './totp';

const DATA_DIR = path.join(process.cwd(), 'data');
const TWO_FACTOR_FILE = path.join(DATA_DIR, 'auth_2fa.json');

export interface StoredBackupCode {
  codeHash: string;
  used: boolean;
  usedAt?: string;
}

export interface TwoFactorStorage {
  enabled: boolean;
  secret: string; // Base32
  backupCodes: StoredBackupCode[];
  configuredAt: string;
}

async function readConfigFile(): Promise<TwoFactorStorage | null> {
  try {
    const data = await fs.readFile(TWO_FACTOR_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed;
  } catch {
    return null;
  }
}

async function writeConfigFile(config: TwoFactorStorage): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(TWO_FACTOR_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

/**
 * Sprawdza czy 2FA jest włączone w systemie (z pliku lub ze zmiennej środowiskowej)
 */
export async function isTwoFactorEnabled(): Promise<boolean> {
  // 1. Sprawdź plik konfiguracyjny
  const fileConfig = await readConfigFile();
  if (fileConfig && fileConfig.enabled && fileConfig.secret) {
    return true;
  }

  // 2. Sprawdź czy zdefiniowano stały klucz w zmiennych środowiskowych
  if (process.env.ADMIN_2FA_SECRET && process.env.ADMIN_2FA_SECRET.trim().length >= 16) {
    return true;
  }

  return false;
}

/**
 * Pobiera publiczny status konfiguracji 2FA (bez ujawniania klucza tajnego)
 */
export async function getTwoFactorStatus(): Promise<{
  enabled: boolean;
  configuredAt?: string;
  remainingBackupCodes: number;
}> {
  const fileConfig = await readConfigFile();
  const envSecret = process.env.ADMIN_2FA_SECRET?.trim();

  if (fileConfig && fileConfig.enabled) {
    const remaining = fileConfig.backupCodes.filter((b) => !b.used).length;
    return {
      enabled: true,
      configuredAt: fileConfig.configuredAt,
      remainingBackupCodes: remaining,
    };
  }

  if (envSecret && envSecret.length >= 16) {
    return {
      enabled: true,
      configuredAt: 'Zmienna środowiskowa (.env)',
      remainingBackupCodes: 0,
    };
  }

  return {
    enabled: false,
    remainingBackupCodes: 0,
  };
}

/**
 * Pobiera aktywny klucz tajny 2FA
 */
export async function getActiveTwoFactorSecret(): Promise<string | null> {
  const fileConfig = await readConfigFile();
  if (fileConfig && fileConfig.enabled && fileConfig.secret) {
    return fileConfig.secret;
  }

  if (process.env.ADMIN_2FA_SECRET && process.env.ADMIN_2FA_SECRET.trim().length >= 16) {
    return process.env.ADMIN_2FA_SECRET.trim();
  }

  return null;
}

/**
 * Zapisuje nową konfigurację 2FA po pomyślnej weryfikacji wstępnej
 */
export async function activateTwoFactor(
  secret: string,
  plainBackupCodes: string[]
): Promise<void> {
  const backupCodes: StoredBackupCode[] = plainBackupCodes.map((code) => ({
    codeHash: hashBackupCode(code),
    used: false,
  }));

  const config: TwoFactorStorage = {
    enabled: true,
    secret,
    backupCodes,
    configuredAt: new Date().toISOString(),
  };

  await writeConfigFile(config);
}

/**
 * Wyłącza 2FA
 */
export async function disableTwoFactor(): Promise<void> {
  try {
    await fs.unlink(TWO_FACTOR_FILE);
  } catch {
    // Plik mógł nie istnieć
  }
}

/**
 * Weryfikuje kod wprowadzony przez użytkownika (kod z Authenticatora LUB kod zapasowy)
 */
export async function verifyTwoFactorCode(code: string): Promise<{
  valid: boolean;
  method: 'totp' | 'backup' | 'none';
  remainingBackupCodes?: number;
}> {
  const cleanCode = code.trim().replace(/[-\s]/g, '');

  const secret = await getActiveTwoFactorSecret();
  if (!secret) {
    return { valid: false, method: 'none' };
  }

  // 1. Próba weryfikacji standardowym kodem TOTP (6 cyfr)
  if (/^\d{6}$/.test(cleanCode)) {
    const isTotpValid = verifyTOTP(cleanCode, secret, 1);
    if (isTotpValid) {
      return { valid: true, method: 'totp' };
    }
  }

  // 2. Próba weryfikacji kodem zapasowym (Recovery Code)
  const fileConfig = await readConfigFile();
  if (fileConfig && fileConfig.enabled && fileConfig.backupCodes.length > 0) {
    const hashedAttempt = hashBackupCode(code);
    const codeIndex = fileConfig.backupCodes.findIndex(
      (b) => !b.used && b.codeHash === hashedAttempt
    );

    if (codeIndex !== -1) {
      // Oznacz kod jako zużyty
      fileConfig.backupCodes[codeIndex].used = true;
      fileConfig.backupCodes[codeIndex].usedAt = new Date().toISOString();
      await writeConfigFile(fileConfig);

      const remaining = fileConfig.backupCodes.filter((b) => !b.used).length;
      return {
        valid: true,
        method: 'backup',
        remainingBackupCodes: remaining,
      };
    }
  }

  return { valid: false, method: 'none' };
}
