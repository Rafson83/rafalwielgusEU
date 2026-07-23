'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [days, setDays] = useState('07');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [progressWidth, setProgressWidth] = useState('0%');

  useEffect(() => {
    // Ustawienie nowej stałej daty startu na 30 lipca 2026 r. o godzinie 18:00:00
    // Zapewni to, że licznik odlicza do tej samej daty u każdego użytkownika.
    const targetDate = new Date('2026-07-30T18:00:00').getTime();
    const totalDuration = 7 * 24 * 60 * 60 * 1000; // 7 dni w ms do kalkulacji paska postępu

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setDays('00');
        setHours('00');
        setMinutes('00');
        setSeconds('00');
        setProgressWidth('100%');
        return;
      }

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setDays(String(d).padStart(2, '0'));
      setHours(String(h).padStart(2, '0'));
      setMinutes(String(m).padStart(2, '0'));
      setSeconds(String(s).padStart(2, '0'));

      // Pasek postępu odlicza od momentu wdrożenia (zakładając 7 dni jako 100%)
      const startPoint = targetDate - totalDuration;
      const elapsed = now - startPoint;
      const percentage = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100));
      setProgressWidth(`${percentage}%`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0b0f19] px-4">
      {/* Background gradients */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[600px] w-full text-center py-12 px-8 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.3),_0_0_50px_rgba(99,102,241,0.15)] z-10 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent tracking-tight">
          rafalwielgus.eu
        </h1>
        <p className="text-base md:text-lg text-gray-400 mb-10 leading-relaxed">
          Trwają prace nad moim nowym blogiem osobistym. <br /> Wracam już niebawem z ciekawymi wpisami!
        </p>

        <div className="flex justify-center gap-4 mb-10">
          <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl min-w-[80px] transition-all hover:-translate-y-1 hover:border-indigo-500 group">
            <span className="text-3xl font-extrabold block leading-none bg-gradient-to-br from-white to-purple-400 bg-clip-text text-transparent">
              {days}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 block">Dni</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl min-w-[80px] transition-all hover:-translate-y-1 hover:border-indigo-500 group">
            <span className="text-3xl font-extrabold block leading-none bg-gradient-to-br from-white to-purple-400 bg-clip-text text-transparent">
              {hours}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 block">Godz</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl min-w-[80px] transition-all hover:-translate-y-1 hover:border-indigo-500 group">
            <span className="text-3xl font-extrabold block leading-none bg-gradient-to-br from-white to-purple-400 bg-clip-text text-transparent">
              {minutes}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 block">Min</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl min-w-[80px] transition-all hover:-translate-y-1 hover:border-indigo-500 group">
            <span className="text-3xl font-extrabold block leading-none bg-gradient-to-br from-white to-purple-400 bg-clip-text text-transparent">
              {seconds}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 block">Sek</span>
          </div>
        </div>

        <div className="w-full h-1.5 bg-white/5 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-out"
            style={{ width: progressWidth }}
          />
        </div>

        <div className="text-xs md:text-sm text-gray-400 border-t border-white/[0.08] pt-6">
          Do zobaczenia za <span className="text-indigo-400 font-semibold">7 dni</span>! &copy; {new Date().getFullYear()} Rafał Wielgus
        </div>
      </div>
    </main>
  );
}
