'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  heading?: string;
  className?: string;
}

export default function Footer({
  heading = 'Rafał Wielgus',
  className = '',
}: FooterProps) {
  const handleOpenCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cookie-settings'));
    }
  };

  return (
    <footer
      id="kontakt"
      className={`flex flex-col justify-between gap-8 border-t border-[#181817] py-10 font-sans sm:flex-row sm:items-end ${className}`}
    >
      <div>
        <p className="font-serif text-3xl font-bold tracking-[-0.04em]">{heading}</p>
        <a
          href="mailto:hello@rafalwielgus.eu"
          className="mt-2 inline-block text-sm text-[#514f49] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#e85d3f]"
        >
          hello@rafalwielgus.eu
        </a>
      </div>

      <div className="flex flex-col items-start gap-3 text-xs sm:items-end sm:gap-2">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[#514f49]">
          <a
            href="/rss.xml"
            target="_blank"
            rel="alternate"
            type="application/rss+xml"
            className="inline-flex items-center gap-1.5 underline decoration-[#e85d3f] underline-offset-4 hover:text-[#e85d3f]"
            title="Subskrybuj kanał RSS"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#e85d3f]"></span>
            RSS Feed
          </a>
          <span>&bull;</span>
          <a
            href="/sitemap.xml"
            target="_blank"
            className="underline decoration-[#e85d3f] underline-offset-4 hover:text-[#181817]"
          >
            Sitemap XML
          </a>
          <span>&bull;</span>
          <Link
            href="/polityka-prywatnosci"
            className="underline decoration-[#e85d3f] underline-offset-4 hover:text-[#181817]"
          >
            Polityka prywatności & RODO
          </Link>
          <span>&bull;</span>
          <button
            type="button"
            onClick={handleOpenCookieSettings}
            className="underline decoration-[#e85d3f] underline-offset-4 hover:text-[#181817]"
          >
            Ustawienia ciasteczek
          </button>
        </div>
        <p className="uppercase tracking-[0.15em] text-[#514f49]">
          &copy; 2026 Rafał Wielgus &bull; Wszelkie prawa zastrzeżone
        </p>
      </div>
    </footer>
  );
}
