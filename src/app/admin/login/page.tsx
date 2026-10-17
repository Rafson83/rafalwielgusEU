'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [step, setStep] = useState<'password' | '2fa'>('password');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [isBackupCodeMode, setIsBackupCodeMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const codeInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (step === '2fa') {
      setTimeout(() => {
        codeInputRef.current?.focus();
      }, 100);
    }
  }, [step, isBackupCodeMode]);

  // Krok 1: Weryfikacja hasła
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Logowanie nie powiodło się');
      }

      if (data.requires2FA) {
        setTempToken(data.tempToken);
        setStep('2fa');
        setCode('');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas logowania');
    } finally {
      setLoading(false);
    }
  };

  // Krok 2: Weryfikacja kodu 2FA (TOTP lub kod zapasowy)
  const handle2FaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken,
          code: code.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Kod weryfikacyjny jest nieprawidłowy');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd weryfikacji kodu');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPassword = () => {
    setStep('password');
    setTempToken('');
    setCode('');
    setError('');
    setIsBackupCodeMode(false);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#0b0f19] px-4 font-sans">
      <div className="max-w-[420px] w-full py-10 px-8 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] text-center">
        
        {/* Logo / Badge */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          {step === 'password' ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )}
        </div>

        <h1 className="text-2xl font-extrabold mb-1 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent tracking-tight">
          {step === 'password' ? 'Panel Zarządzania' : 'Logowanie 2FA'}
        </h1>
        <p className="text-xs text-gray-400 mb-6">
          {step === 'password'
            ? 'Rafał Wielgus • Notatnik & Blog'
            : isBackupCodeMode
            ? 'Wprowadź jednorazowy kod zapasowy'
            : 'Podaj kod z aplikacji Authenticator'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl mb-6 text-left">
            {error}
          </div>
        )}

        {step === 'password' ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-5">
            <div className="text-left">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-2 font-semibold">
                Hasło dostępowe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wprowadź hasło"
                required
                autoFocus
                className="w-full bg-white/[0.03] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white/[0.05] transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-3 font-semibold text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? 'Sprawdzam hasło...' : 'Przejdź dalej →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handle2FaSubmit} className="space-y-5">
            <div className="text-left">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 block mb-2 font-semibold">
                {isBackupCodeMode ? 'Jednorazowy kod zapasowy' : '6-cyfrowy kod TOTP'}
              </label>
              <input
                ref={codeInputRef}
                type="text"
                inputMode={isBackupCodeMode ? 'text' : 'numeric'}
                pattern={isBackupCodeMode ? undefined : '[0-9]*'}
                autoComplete="one-time-code"
                maxLength={isBackupCodeMode ? 12 : 6}
                value={code}
                onChange={(e) => {
                  const val = e.target.value;
                  setCode(isBackupCodeMode ? val.toUpperCase() : val.replace(/\D/g, ''));
                }}
                placeholder={isBackupCodeMode ? 'np. A1B2-C3D4' : '000 000'}
                required
                className={`w-full bg-white/[0.03] border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white/[0.05] transition-all text-center tracking-[0.25em] font-mono ${
                  isBackupCodeMode ? 'text-base' : 'text-2xl font-bold'
                }`}
              />
              <p className="mt-2 text-[11px] text-gray-500 text-center">
                {isBackupCodeMode
                  ? 'Kod zapasowy wygenerowany podczas konfiguracji 2FA.'
                  : 'Google Authenticator, Microsoft Authenticator, Apple Passwords lub 1Password.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || (isBackupCodeMode ? code.trim().length < 6 : code.trim().length !== 6)}
              className="w-full bg-gradient-to-r from-indigo-500 to-emerald-500 text-white rounded-xl py-3 font-semibold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40"
            >
              {loading ? 'Weryfikuję kod...' : 'Potwierdź i zaloguj się →'}
            </button>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsBackupCodeMode(!isBackupCodeMode);
                  setCode('');
                  setError('');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {isBackupCodeMode
                  ? '← Wróć do standardowego kodu z aplikacji'
                  : 'Nie masz dostępu do telefonu? Użyj kodu zapasowego'}
              </button>

              <button
                type="button"
                onClick={handleBackToPassword}
                className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
              >
                ← Wróć do logowania hasłem
              </button>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}
