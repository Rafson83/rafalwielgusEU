'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { number: '01', label: 'Start', href: '/' },
    { number: '02', label: 'O mnie', href: '/o-mnie' },
    { number: '03', label: 'Produkty', href: '/produkty' },
    { number: '04', label: 'Blog', href: '/blog' },
    { number: '05', label: 'Kontakt', href: '#kontakt' },
  ];

  const isItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '#kontakt') return false;
    return pathname.startsWith(href);
  };

  // Blokowanie przewijania strony, gdy menu boczne jest otwarte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Zamykanie menu po wciśnięciu klawisza ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Zamykanie menu po zmianie podstrony
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="relative flex items-center justify-between border-b border-[#181817] py-4 sm:py-5">
        <Logo />

        {/* Menu na duże ekrany (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-sans text-xs font-bold uppercase tracking-[0.14em]">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`transition-all py-1 ${
                  active
                    ? 'border-b-2 border-[#e85d3f] text-[#e85d3f]'
                    : 'text-[#181817] hover:text-[#e85d3f]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Przycisk Hamburgera na urządzenia mobilne */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex md:hidden h-10 w-10 items-center justify-center border border-[#181817] bg-[#ede7dc]/60 text-[#181817] shadow-[2px_2px_0_#181817] transition-all hover:bg-[#ede7dc] active:translate-y-0.5 active:shadow-none"
          aria-label="Otwórz menu nawigacji"
          aria-expanded={isOpen}
          aria-controls="mobile-sidebar-nav"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Tło przyciemniające (Backdrop) */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Boczne menu wysuwane (Mobile Slide-out Drawer) */}
      <aside
        id="mobile-sidebar-nav"
        aria-label="Mobilne menu nawigacyjne"
        className={`fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-sm flex-col justify-between border-l-2 border-[#181817] bg-[#f4f0e9] p-6 shadow-2xl transition-transform duration-300 ease-in-out md:hidden sm:p-8 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Nagłówek menu bocznego */}
        <div>
          <div className="flex items-center justify-between border-b border-[#181817]/20 pb-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center bg-[#181817] font-serif text-sm font-bold text-[#f4f0e9]">
                RW<span className="text-[#e85d3f]">.</span>
              </span>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                Nawigacja
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 items-center justify-center border border-[#181817] bg-white text-[#181817] shadow-[2px_2px_0_#181817] transition-all hover:bg-[#ede7dc] active:translate-y-0.5 active:shadow-none"
              aria-label="Zamknij menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Lista odnośników nawigacyjnych */}
          <nav className="mt-8 flex flex-col space-y-4">
            {navItems.map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center justify-between border border-[#181817]/20 bg-white/70 px-4 py-3.5 transition-all hover:border-[#181817] hover:bg-white hover:shadow-[3px_3px_0_#e85d3f] ${
                    active ? 'border-[#e85d3f] bg-white shadow-[3px_3px_0_#e85d3f]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-[11px] font-bold text-[#e85d3f]">
                      {item.number}
                    </span>
                    <span className="font-serif text-xl font-bold tracking-tight text-[#181817]">
                      {item.label}
                    </span>
                  </div>
                  <span className="font-sans text-xs text-[#514f49] group-hover:text-[#e85d3f]">
                    &rarr;
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dolna stopka w menu bocznym */}
        <div className="border-t border-[#181817]/20 pt-6">
          <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
            Rytm wydawniczy
          </p>
          <p className="mt-1 font-serif text-sm font-bold text-[#181817]">
            Wtorki & Czwartki &bull; 09:00
          </p>
          <a
            href="mailto:hello@rafalwielgus.eu"
            className="mt-3 block font-sans text-xs text-[#514f49] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#181817]"
          >
            hello@rafalwielgus.eu
          </a>
        </div>
      </aside>
    </>
  );
}
