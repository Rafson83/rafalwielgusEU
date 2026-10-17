'use client';

import React, { useState, useEffect } from 'react';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TwoFactorModal({ isOpen, onClose, onSuccess }: TwoFactorModalProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    enabled: boolean;
    configuredAt?: string;
    remainingBackupCodes?: number;
  } | null>(null);

  // Stan konfiguratora
  const [setupData, setSetupData] = useState<{
    secret: string;
    totpUri: string;
    qrCodeDataUrl: string;
    backupCodes: string[];
  } | null>(null);

  const [verifyCode, setVerifyCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [isDisabling, setIsDisabling] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Pobierz status 2FA przy otwarciu modalu
  const fetchStatus = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/2fa');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      setError('Błąd połączenia z serwerem podczas pobierania statusu 2FA');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setSetupData(null);
      setError('');
      setSuccessMessage('');
      setIsDisabling(false);
      setDisablePassword('');
      setVerifyCode('');
    }
  }, [isOpen]);

  // Rozpocznij generowanie nowego klucza 2FA
  const handleStartSetup = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/2fa', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSetupData(data);
      } else {
        setError(data.error || 'Nie udało się wygenerować konfiguracji 2FA');
      }
    } catch {
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  // Potwierdź kod i aktywuj 2FA
  const handleConfirmActivation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupData || verifyCode.trim().length !== 6) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/2fa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: setupData.secret,
          code: verifyCode.trim(),
          backupCodes: setupData.backupCodes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || '2FA aktywowane pomyślnie!');
        setSetupData(null);
        await fetchStatus();
        onSuccess?.();
      } else {
        setError(data.error || 'Nieprawidłowy kod weryfikacyjny');
      }
    } catch {
      setError('Błąd serwera podczas aktywacji 2FA');
    } finally {
      setLoading(false);
    }
  };

  // Wyłącz 2FA
  const handleDisable2Fa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disablePassword) return;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/2fa', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: disablePassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMessage(data.message || '2FA zostało wyłączone');
        setIsDisabling(false);
        setDisablePassword('');
        await fetchStatus();
        onSuccess?.();
      } else {
        setError(data.error || 'Nieprawidłowe hasło');
      }
    } catch {
      setError('Błąd serwera podczas wyłączania 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySecret = async () => {
    if (!setupData) return;
    try {
      await navigator.clipboard.writeText(setupData.secret);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleCopyBackupCodes = async () => {
    if (!setupData) return;
    try {
      await navigator.clipboard.writeText(setupData.backupCodes.join('\n'));
      setCopiedCodes(true);
      setTimeout(() => setCopiedCodes(false), 2000);
    } catch {
      // fallback
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header modalu */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Logowanie dwuskładnikowe (2FA)</h3>
              <p className="text-xs text-gray-400">Ochrona panelu administratora za pomocą Authenticatora (TOTP)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Komunikaty */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-300">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
            {successMessage}
          </div>
        )}

        {loading && !setupData && (
          <div className="py-12 text-center text-sm text-gray-400">
            Ładowanie stanu bezpieczeństwa...
          </div>
        )}

        {/* 1. Stan: 2FA JEST WŁĄCZONE */}
        {!loading && status?.enabled && !setupData && (
          <div className="space-y-6">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-sm font-bold text-emerald-300">2FA jest AKTYWNE</span>
              </div>
              <p className="mt-2 text-xs text-gray-300">
                Twój panel jest zabezpieczony. Przy każdym logowaniu wymagany jest 6-cyfrowy kod z aplikacji Authenticator lub jednorazowy kod zapasowy.
              </p>
              {status.configuredAt && (
                <p className="mt-2 text-[11px] text-gray-400">
                  Data aktywacji: {status.configuredAt.slice(0, 10)}
                </p>
              )}
            </div>

            {/* Opcja wyłączenia 2FA */}
            {isDisabling ? (
              <form onSubmit={handleDisable2Fa} className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 space-y-4">
                <p className="text-xs font-semibold text-red-300">
                  Aby wyłączyć 2FA, potwierdź to hasłem administratora:
                </p>
                <input
                  type="password"
                  required
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="Hasło administratora"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 disabled:opacity-50"
                  >
                    {loading ? 'Wyłączam...' : 'Potwierdź wyłączenie 2FA'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDisabling(false)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-xs text-gray-300 hover:bg-white/5"
                  >
                    Anuluj
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={handleStartSetup}
                  className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20"
                >
                  🔄 Skonfiguruj ponownie (nowy klucz)
                </button>
                <button
                  type="button"
                  onClick={() => setIsDisabling(true)}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/20"
                >
                  Wyłącz 2FA
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. Stan: 2FA JEST WYŁĄCZONE (zachęta do włączenia) */}
        {!loading && !status?.enabled && !setupData && (
          <div className="space-y-6">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 rounded-full bg-amber-400"></span>
                <span className="text-sm font-bold text-amber-300">2FA jest obecnie WYŁĄCZONE</span>
              </div>
              <p className="mt-2 text-xs text-gray-300">
                Logowanie do Twojego panelu opiera się wyłącznie na haśle. Włączenie weryfikacji dwuskładnikowej zabezpiecza blog przed nieautoryzowanym dostępem, nawet jeśli ktoś pozna Twoje hasło.
              </p>
            </div>

            <div className="flex justify-end border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={handleStartSetup}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                Rozpocznij konfigurację 2FA →
              </button>
            </div>
          </div>
        )}

        {/* 3. KREATOR KONFIGURACJI: Wyświetlanie kodu QR i weryfikacja */}
        {setupData && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold">1</span>
                <h4 className="text-sm font-bold text-white">Zeskanuj kod QR lub wpisz klucz w aplikacji Authenticator</h4>
              </div>
              <p className="text-xs text-gray-300">
                Otwórz aplikację <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong>, <strong>Apple Passwords</strong> lub <strong>2FAS</strong>:
              </p>

              <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="p-3 bg-white rounded-2xl shrink-0 shadow-2xl">
                  <img
                    src={setupData.qrCodeDataUrl}
                    alt="Kod QR 2FA"
                    className="h-52 w-52 sm:h-56 sm:w-56 block object-contain"
                  />
                </div>

                <div className="space-y-3 text-left w-full">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200 space-y-1.5">
                    <p className="font-semibold flex items-center gap-1.5">
                      <span>💡</span>
                      <span>Co dzieje się po zeskanowaniu?</span>
                    </p>
                    <p className="text-[11px] text-indigo-300/90 leading-relaxed">
                      Aplikacja aparatu w Authenticatorze po ułamku sekundy automatycznie się zamyka i wraca do ekranu głównego. Na liście kont pojawi się nowa pozycja <strong>RafalWielgus</strong> z 6-cyfrowym kodem.
                    </p>
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-semibold text-gray-300 mb-1.5">
                      Nie chcesz skanować aparatem? Wpisz klucz ręcznie:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="rounded-lg bg-black/60 px-3 py-2 font-mono text-xs text-amber-300 font-bold tracking-wider select-all border border-amber-500/20 break-all">
                        {setupData.secret}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopySecret}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-gray-200 hover:bg-white/15 transition-all shrink-0"
                      >
                        {copiedKey ? '✓ Skopiowano' : 'Kopiuj'}
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      W Authenticatorze wybierz <strong>+</strong> &rarr; <strong>Wpisz klucz konfiguracji</strong> (Nazwa: <code>RafalWielgus</code>, Typ: <code>W oparciu o czas</code>).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Kody zapasowe */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold">2</span>
                  <h4 className="text-sm font-bold text-white">Zapisz kody zapasowe (Recovery Codes)</h4>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBackupCodes}
                  className="text-xs text-indigo-400 hover:text-indigo-300 underline"
                >
                  {copiedCodes ? '✓ Skopiowano wszystkie' : 'Kopiuj wszystkie kody'}
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Umożliwią Ci zalogowanie, jeśli zgubisz telefon. Każdy kod jest jednorazowy.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-gray-200">
                {setupData.backupCodes.map((c, i) => (
                  <div key={i} className="text-center py-1 bg-white/5 rounded">
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Potwierdzenie kodem */}
            <form onSubmit={handleConfirmActivation} className="space-y-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold">3</span>
                <label className="text-sm font-bold text-white">
                  Potwierdź kodem z aplikacji Authenticator
                </label>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="np. 123456"
                  className="w-44 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center font-mono text-lg font-bold tracking-[0.2em] text-white outline-none focus:border-emerald-500"
                />

                <button
                  type="submit"
                  disabled={loading || verifyCode.trim().length !== 6}
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
                >
                  {loading ? 'Weryfikuję...' : 'Aktywuj 2FA teraz ✓'}
                </button>

                <button
                  type="button"
                  onClick={() => setSetupData(null)}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs text-gray-400 hover:text-white"
                >
                  Anuluj
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
