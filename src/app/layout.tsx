import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import CookieBanner from '@/components/CookieBanner';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin', 'latin-ext'],
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'latin-ext'],
});

export const viewport: Viewport = {
  themeColor: '#181817',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://rafalwielgus.eu'),
  title: {
    default: 'Rafał Wielgus | Myślę. Buduję. Piszę.',
    template: '%s — Rafał Wielgus',
  },
  description:
    'Osobista strona Rafała Wielgusa. O ludziach, technologii, automatyce przemysłowej w recyklingu, psychologii decyzji i filozofii Long-Life Learning.',
  keywords: [
    'Rafał Wielgus',
    'Long-Life Learning',
    'automatyka przemysłowa',
    'utrzymanie ruchu',
    'recykling',
    'psychologia pracy',
    'kontrola jakości',
    'Lean Agile',
    'sztuczna inteligencja',
    'technik elektronik',
    'Kod Kariery',
  ],
  authors: [{ name: 'Rafał Wielgus', url: 'https://rafalwielgus.eu/o-mnie' }],
  creator: 'Rafał Wielgus',
  publisher: 'Rafał Wielgus',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://rafalwielgus.eu',
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://rafalwielgus.eu',
    siteName: 'Rafał Wielgus',
    title: 'Rafał Wielgus | Myślę. Buduję. Piszę.',
    description:
      'Osobista strona Rafała Wielgusa. O ludziach, technologii, automatyce przemysłowej, psychologii i rzemiośle pracy.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rafał Wielgus | Myślę. Buduję. Piszę.',
    description:
      'Osobista strona Rafała Wielgusa. O ludziach, technologii, automatyce przemysłowej, psychologii i rzemiośle pracy.',
    creator: '@rafalwielgus',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf6f0] text-[#1c1917]">
        <GoogleAnalytics />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
