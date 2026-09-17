'use client';

import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'header' | 'footer' | 'compact';
}

export default function Logo({ className = '', variant = 'header' }: LogoProps) {
  if (variant === 'compact') {
    return (
      <Link
        href="/"
        className={`group inline-flex items-center gap-2.5 transition-transform hover:-translate-y-0.5 ${className}`}
        aria-label="Rafał Wielgus - Strona główna"
      >
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[#181817] shadow-[2px_2px_0_#e85d3f] transition-all group-hover:shadow-[3px_3px_0_#e85d3f]">
          {/* Circuit Monogram SVG */}
          <svg
            viewBox="0 0 36 36"
            className="h-6 w-6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* R stem & loop */}
            <path
              d="M8 8V28M8 8H16C19 8 20.5 10 20.5 13C20.5 16 19 18 16 18H8M15 18L21 28"
              stroke="#f4f0e9"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* W geometric integration */}
            <path
              d="M19 19L23 28L26.5 20L30 28"
              stroke="#e85d3f"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Logic node dot */}
            <circle cx="30" cy="11" r="2.2" fill="#e85d3f" />
          </svg>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-3.5 transition-all ${className}`}
      aria-label="Rafał Wielgus - Strona główna"
    >
      {/* Engineered Emblem / Sygnet */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#181817] border border-[#181817] shadow-[3px_3px_0_#e85d3f] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0_#e85d3f]">
        <svg
          viewBox="0 0 36 36"
          className="h-7 w-7 transition-transform duration-200 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* R Stem */}
          <path
            d="M8 7V29"
            stroke="#f4f0e9"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* R Loop */}
          <path
            d="M8 7H16C19.5 7 21 9.2 21 12.5C21 15.8 19.5 18 16 18H8"
            stroke="#f4f0e9"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* R leg merging into circuit path */}
          <path
            d="M15 18L21 29"
            stroke="#f4f0e9"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Connected W / Electronic Wave in Terracotta */}
          <path
            d="M19 19L23 29L26.5 18L30 29"
            stroke="#e85d3f"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Terminal / Logic pulse point */}
          <circle
            cx="30"
            cy="10"
            r="2.2"
            fill="#e85d3f"
            className="transition-transform duration-300 group-hover:scale-125"
          />
        </svg>
      </div>

      {/* Typographic Lockup */}
      <div className="flex flex-col justify-center text-left">
        <span className="font-sans text-sm font-black uppercase tracking-[0.16em] text-[#181817] transition-colors group-hover:text-[#e85d3f]">
          Rafał Wielgus
        </span>
        <span className="font-sans text-[9px] font-bold uppercase tracking-[0.22em] text-[#514f49]">
          Kod <span className="text-[#e85d3f]">&bull;</span> Proces <span className="text-[#e85d3f]">&bull;</span> Człowiek
        </span>
      </div>
    </Link>
  );
}
