import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin', 'latin-ext'],
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  title: 'Rafał Wielgus | Myślę. Buduję. Piszę.',
  description: 'Osobista strona Rafała Wielgusa. O ludziach, technologii i pracy.',
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
        {children}
      </body>
    </html>
  );
}
