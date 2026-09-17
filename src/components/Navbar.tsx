'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Start', href: '/' },
    { label: 'O mnie', href: '/o-mnie' },
    { label: 'Produkty', href: '/produkty' },
    { label: 'Blog', href: '/blog' },
    { label: 'Kontakt', href: '#kontakt' },
  ];

  const isItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '#kontakt') return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="flex items-center justify-between border-b border-[#181817] py-4 sm:py-5">
      <Logo />

      <nav className="flex items-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.14em] sm:gap-7">
        {navItems.map((item) => {
          const active = isItemActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`transition-all ${
                active
                  ? 'border-b-2 border-[#e85d3f] pb-1 text-[#e85d3f]'
                  : 'text-[#181817] hover:text-[#e85d3f]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
