'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
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

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas logowania');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#0b0f19] px-4 font-sans">
      <div className="max-w-[400px] w-full py-10 px-8 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.3)] text-center">
        <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent tracking-tight">
          Panel Admina
        </h1>
        <p className="text-sm text-gray-400 mb-8">Zaloguj się, aby zarządzać wpisami na blogu</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-left">
            <label className="text-xs uppercase tracking-wider text-gray-500 block mb-2 font-semibold">
              Hasło dostępowe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wprowadź hasło"
              required
              className="w-full bg-white/[0.02] border border-white/[0.08] text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:bg-white/[0.04] transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl py-3 font-semibold text-sm shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>
      </div>
    </main>
  );
}
