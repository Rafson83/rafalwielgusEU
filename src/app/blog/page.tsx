import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogClientView from '@/components/BlogClientView';
import { getEffectivePublicPosts } from '@/lib/posts-server';

export const metadata: Metadata = {
  title: 'Blog & Notatnik — Rafał Wielgus',
  description:
    'Autorskie eseje i notatki o psychologii decyzji, technologii, automatyzacji i rzemiośle pracy. Bez lania wody, z konkretem i warsztatową rzetelnością.',
  alternates: {
    canonical: 'https://rafalwielgus.eu/blog',
  },
  openGraph: {
    title: 'Blog & Notatnik — Rafał Wielgus',
    description:
      'Autorskie eseje i notatki o psychologii decyzji, technologii, automatyzacji i rzemiośle pracy.',
    url: 'https://rafalwielgus.eu/blog',
    siteName: 'Rafał Wielgus',
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Notatnik — Rafał Wielgus',
    description:
      'Autorskie eseje i notatki o psychologii decyzji, technologii, automatyzacji i rzemiośle pracy.',
  },
};

export default async function BlogPage() {
  const posts = await getEffectivePublicPosts({ includeScheduled: true });

  const jsonLdBlog = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Blog & Notatnik — Rafał Wielgus',
    description:
      'Autorskie eseje i notatki o psychologii decyzji, technologii, automatyzacji i rzemiośle pracy.',
    url: 'https://rafalwielgus.eu/blog',
    author: {
      '@type': 'Person',
      name: 'Rafał Wielgus',
      url: 'https://rafalwielgus.eu/o-mnie',
    },
    inLanguage: 'pl-PL',
  };

  return (
    <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
      {/* Schema.org Blog Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBlog) }}
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Navbar />
        <BlogClientView initialPosts={posts} />
        <Footer heading="Porozmawiajmy o technice, procesach i ludziach." />
      </div>
    </main>
  );
}
