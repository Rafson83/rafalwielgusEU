'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Sprawdzamy czy użytkownik dokonał już wyboru
    const consent = localStorage.getItem('rw_cookie_consent');
    if (!consent) {
      // Drobne opóźnienie, aby baner pojawił się płynnie po załadowaniu
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Nasłuchiwanie na ponowne otwarcie preferencji ze stopki
    const handleOpenSettings = () => setIsOpen(true);
    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  const handleConsent = (level: 'all' | 'necessary') => {
    localStorage.setItem('rw_cookie_consent', level);
    localStorage.setItem('rw_cookie_consent_date', new Date().toISOString());

    // Aktualizacja stanu Google Consent Mode v2
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: level === 'all' ? 'granted' : 'denied',
      });
    }

    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Zgoda na pliki cookies"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-5 duration-300 sm:bottom-6 sm:left-6 sm:right-auto"
    >
      <div className="border-2 border-[#181817] bg-[#ffffff] p-6 sm:p-8 shadow-[8px_8px_0_#181817]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-[#181817] px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-wider text-white">
            Prywatność & Cookies
          </span>
          <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#e85d3f]">
            Zgodność z RODO / UODO
          </span>
        </div>

        <h3 className="mt-3 font-serif text-xl font-bold tracking-tight text-[#181817] sm:text-2xl">
          Szanuję Twoją prywatność i przestrzeń cyfrową.
        </h3>

        <p className="mt-2 font-sans text-xs leading-5 text-[#514f49] sm:text-sm sm:leading-6">
          Ta strona używa wyłącznie niezbędnych plików cookies do prawidłowego działania serwisu, sesji oraz zapamiętania Twoich preferencji. Nie stosuję inwazyjnych trackerów reklamowych ani nie handluję Twoimi danymi. Szczegóły znajdziesz w dokumencie{' '}
          <Link
            href="/polityka-prywatnosci"
            className="font-bold text-[#181817] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#e85d3f]"
          >
            Polityka prywatności & RODO
          </Link>
          .
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleConsent('all')}
            className="bg-[#181817] px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#e85d3f]"
          >
            Akceptuję
          </button>
          <button
            onClick={() => handleConsent('necessary')}
            className="border border-[#181817] bg-white px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-[#181817] transition-all hover:-translate-y-0.5 hover:bg-[#ede7dc]"
          >
            Tylko niezbędne
          </button>
          <Link
            href="/polityka-prywatnosci"
            className="ml-auto font-sans text-xs font-bold text-[#514f49] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#181817]"
          >
            Więcej informacji &rarr;
          </Link>
        </div>
      </div>
    </aside>
  );
}
