import mysql, { Pool, PoolOptions } from 'mysql2/promise';

const rawUrl = process.env.DATABASE_URL?.trim() || '';
const isDummyUrl =
  !rawUrl ||
  rawUrl.includes('user:password@localhost') ||
  rawUrl.includes('user:password@127.0.0.1') ||
  rawUrl.includes('dbname') ||
  rawUrl === 'mysql://localhost';

// Stan Circuit Breaker (bezpiecznik przed zawieszaniem zapytań)
let isDbHealthy = !isDummyUrl;
let lastFailureTimestamp = 0;
const RETRY_INTERVAL_MS = 30_000; // 30 sekund przerwy po błędzie połączenia

let pool: Pool | null = null;

if (!isDummyUrl) {
  try {
    const config: PoolOptions = {
      uri: rawUrl,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 1000, // Maksymalnie 1s na nawiązanie połączenia
    };
    pool = mysql.createPool(config);
  } catch (err) {
    console.warn('[DB] Błąd tworzenia puli połączeń MySQL:', err);
    isDbHealthy = false;
    lastFailureTimestamp = Date.now();
  }
} else {
  isDbHealthy = false;
}

export const db = {
  get isConfigured(): boolean {
    return !isDummyUrl;
  },

  get isAvailable(): boolean {
    if (isDummyUrl || !pool) return false;
    if (!isDbHealthy) {
      // Jeśli minął czas odnowienia, pozwalamy na jedną próbę sondowania
      if (Date.now() - lastFailureTimestamp > RETRY_INTERVAL_MS) {
        return true;
      }
      return false;
    }
    return true;
  },

  // Bezpieczne zapytanie z limitem czasu 1500ms i natychmiastowym przełączeniem na fallback
  async query<T = any>(sql: string, values?: any): Promise<[T, any]> {
    if (!this.isAvailable || !pool) {
      throw new Error('[DB] Baza danych MySQL jest wyłączona lub niedostępna (używam fallbacku)');
    }

    try {
      const queryPromise = pool.query<any>(sql, values);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('[DB] Limit czasu zapytania MySQL przekroczony (1500ms)')), 1500)
      );

      const result = await Promise.race([queryPromise, timeoutPromise]);
      isDbHealthy = true;
      return result as [T, any];
    } catch (err: any) {
      isDbHealthy = false;
      lastFailureTimestamp = Date.now();
      throw err;
    }
  },
};
