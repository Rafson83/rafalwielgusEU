import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import NewsletterBox from '@/components/NewsletterBox';
import Footer from '@/components/Footer';
import MarkdownView from '@/components/MarkdownView';
import CommentsSection from '@/components/CommentsSection';
import RelatedPosts from '@/components/RelatedPosts';
import { getEffectivePostBySlug, getRelatedPosts } from '@/lib/posts-server';
import { formatPolishDateWithWeekday } from '@/lib/posts';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getEffectivePostBySlug(slug, { isPreview: true });

  if (!post) {
    return {
      title: 'Artykuł nie został odnaleziony — Rafał Wielgus',
      robots: { index: false, follow: false },
    };
  }

  const title = post.seoTitle || `${post.title} — Rafał Wielgus`;
  const description = post.seoDescription || post.content.split('\n\n')[0].slice(0, 160);
  const keywords = post.tags
    ? post.tags.split(',').map((t) => t.trim())
    : ['Rafał Wielgus', post.category, 'Long-Life Learning', 'automatyka', 'psychologia', 'jakosc'];
  const canonicalUrl = `https://rafalwielgus.eu/blog/${post.slug}`;
  const ogImages = post.thumbnailUrl
    ? [{ url: post.thumbnailUrl, width: 1200, height: 630, alt: post.title }]
    : undefined;

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Rafał Wielgus', url: 'https://rafalwielgus.eu/o-mnie' }],
    creator: 'Rafał Wielgus',
    publisher: 'Rafał Wielgus',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Rafał Wielgus — Blog & Notatnik',
      locale: 'pl_PL',
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt || post.createdAt,
      authors: ['https://rafalwielgus.eu/o-mnie'],
      section: post.category,
      tags: keywords,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@rafalwielgus',
      images: post.thumbnailUrl ? [post.thumbnailUrl] : undefined,
    },
    robots: {
      index: !post.isScheduled,
      follow: true,
      googleBot: {
        index: !post.isScheduled,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sParams = await searchParams;
  const previewMode = sParams.preview === 'true' || sParams.admin === 'true';

  const post = await getEffectivePostBySlug(slug, { isPreview: previewMode });

  if (!post) {
    return (
      <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Navbar />

          <div className="my-20 border border-[#181817] bg-[#ede7dc]/40 p-12 text-center sm:p-16">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
              Błąd 404
            </span>
            <h1 className="mt-4 font-serif text-3xl font-black sm:text-5xl">
              Artykuł nie został odnaleziony
            </h1>
            <p className="mx-auto mt-4 max-w-md font-sans text-base text-[#514f49]">
              Wygląda na to, że ten wpis nie istnieje lub został przeniesiony.
            </p>
            <div className="mt-8">
              <Link
                href="/blog"
                className="bg-[#181817] px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e85d3f]"
              >
                &larr; Wróć do spisu artykułów
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Pobierz powiązane wpisy do sekcji "Przeczytaj również"
  const relatedPosts = await getRelatedPosts(post.slug, 2);

  // Jeśli artykuł jest zaplanowany na przyszłą datę i czytelnik nie włączył trybu podglądu roboczego
  if (post.isScheduled && !previewMode) {
    return (
      <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Navbar />

          <div className="pt-8">
            <Link
              href="/blog"
              className="inline-flex items-center font-sans text-xs font-bold uppercase tracking-wider text-[#514f49] transition-colors hover:text-[#e85d3f]"
            >
              &larr; Wróć do spisu artykułów
            </Link>
          </div>

          <div className="mx-auto my-10 max-w-4xl border border-[#181817] bg-[#ede7dc]/60 p-5 sm:p-14 shadow-[5px_5px_0_#181817] sm:shadow-[10px_10px_0_#181817]">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-[#181817] px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
                Zaplanowana premiera
              </span>
              <span className="bg-[#e85d3f] px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
                {post.category}
              </span>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#514f49]">
                Wtorki & Czwartki &bull; 09:00
              </span>
            </div>

            <h1 className="mt-5 font-serif text-[clamp(1.85rem,5vw,3.75rem)] font-black leading-[1.05] tracking-[-0.04em] break-words">
              {post.title}
            </h1>

            <div className="mt-5 inline-flex flex-wrap items-center gap-2.5 border border-[#181817] bg-white px-3.5 py-2.5 shadow-[3px_3px_0_#181817]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e85d3f] animate-pulse"></span>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                Premiera: <strong>{formatPolishDateWithWeekday(post.createdAt)}</strong> o <strong>09:00</strong>
              </span>
            </div>

            {post.seoDescription && (
              <p className="mt-8 font-sans text-lg leading-relaxed text-[#514f49]">
                {post.seoDescription}
              </p>
            )}

            {/* Teaser fragment */}
            <div className="mt-10 border-t border-[#181817]/20 pt-8">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
                Wprowadzenie do eseju
              </span>
              <div className="mt-4 font-serif text-lg leading-relaxed text-[#181817]/90 italic sm:text-xl">
                „{post.content.split('\n\n')[0]}”
              </div>
              <p className="mt-6 font-sans text-xs uppercase tracking-wider text-[#514f49]">
                Pełna treść eseju, schematy myślowe i wnioski ukażą się we wskazanym dniu o godz. 09:00.
              </p>
            </div>

            {/* Action buttons */}
            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-[#181817]/20 pt-8">
              <Link
                href="/blog"
                className="bg-[#181817] px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e85d3f]"
              >
                &larr; Wróć do opublikowanych esejów
              </Link>
              <Link
                href="/blog?tab=scheduled"
                className="border border-[#181817] bg-white px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-[#181817] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#181817]"
              >
                Zobacz pełny harmonogram premier &rarr;
              </Link>
              <Link
                href={`/blog/${post.slug}?preview=true`}
                className="ml-auto font-sans text-xs font-bold text-[#514f49] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#e85d3f]"
              >
                Podgląd roboczy (dla autora)
              </Link>
            </div>
          </div>

          {/* Sekcja Przeczytaj również dla zaplanowanego wpisu */}
          <RelatedPosts posts={relatedPosts} />
        </div>
      </main>
    );
  }

  const readingTime = post
    ? Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200))
    : 1;

  // Ustrukturyzowane dane JSON-LD (Schema.org) dla wyszukiwarek (Google Article & Breadcrumbs)
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.content.split('\n\n')[0].slice(0, 160),
    image: post.thumbnailUrl ? [post.thumbnailUrl] : [],
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: 'Rafał Wielgus',
      jobTitle: 'Technik elektronik, praktyk automatyki przemysłowej & jakości',
      url: 'https://rafalwielgus.eu/o-mnie',
    },
    publisher: {
      '@type': 'Person',
      name: 'Rafał Wielgus',
      url: 'https://rafalwielgus.eu',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://rafalwielgus.eu/blog/${post.slug}`,
    },
    keywords: post.tags || '',
    articleSection: post.category,
    inLanguage: 'pl-PL',
  };

  const jsonLdBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Strona główna',
        item: 'https://rafalwielgus.eu',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog & Notatnik',
        item: 'https://rafalwielgus.eu/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://rafalwielgus.eu/blog/${post.slug}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
      {/* Skrypty JSON-LD dla robotów wyszukiwarek */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Navbar />

        {/* Tryb podglądu dla zaplanowanego wpisu */}
        {post.isScheduled && previewMode && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-[#e85d3f] bg-[#ede7dc] p-4 font-sans text-xs font-bold uppercase tracking-wider text-[#181817] shadow-[4px_4px_0_#e85d3f]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#e85d3f] animate-ping"></span>
              <span>
                Tryb podglądu roboczego &bull; Premiera czytelnicza:{' '}
                {formatPolishDateWithWeekday(post.createdAt)} o 09:00
              </span>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="underline decoration-[#e85d3f] underline-offset-2 hover:text-[#e85d3f]"
            >
              Zamknij podgląd roboczy &times;
            </Link>
          </div>
        )}

        {/* Back Link */}
        <div className="pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center font-sans text-xs font-bold uppercase tracking-wider text-[#514f49] transition-colors hover:text-[#e85d3f]"
          >
            &larr; Wróć do spisu artykułów
          </Link>
        </div>

        {/* Article Container */}
        <article className="py-10 sm:py-16">
          {/* Article Header */}
          <header className="mx-auto max-w-4xl border-b border-[#181817] pb-12 text-center">
            <div className="flex flex-wrap justify-center items-center gap-3">
              <span className="bg-[#e85d3f] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
                {post.category}
              </span>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#514f49]">
                {readingTime} min czytania
              </span>
            </div>

            <h1 className="mt-6 font-serif text-[clamp(2.1rem,6vw,4.5rem)] font-black leading-[1.02] tracking-[-0.04em] text-balance break-words">
              {post.title}
            </h1>

            <div className="mt-8 flex flex-wrap justify-center items-center gap-4 font-sans text-xs font-bold uppercase tracking-wider text-[#514f49]">
              <span>Rafał Wielgus</span>
              <span>&bull;</span>
              <span>{formatPolishDateWithWeekday(post.createdAt)}</span>
            </div>

            {post.tags && (
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {post.tags.split(',').map((tag) => (
                  <span
                    key={tag.trim()}
                    className="border border-[#181817]/20 bg-[#ede7dc]/40 px-2.5 py-1 font-sans text-[11px] text-[#514f49]"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {post.thumbnailUrl && (
            <div className="mx-auto my-8 sm:my-12 max-w-4xl overflow-hidden border border-[#181817] shadow-[5px_5px_0_#181817] sm:shadow-[10px_10px_0_#181817]">
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="max-h-[520px] w-full object-cover"
              />
            </div>
          )}

          {/* Article Content Body */}
          <div className="mx-auto mt-12 max-w-3xl font-serif text-lg leading-[1.85] text-[#181817] sm:text-xl sm:leading-[1.9]">
            <MarkdownView content={post.content} theme="light" enableDropCap={true} />
          </div>

          {/* Author Box */}
          <div className="mx-auto mt-14 max-w-3xl border border-[#181817] bg-[#ede7dc]/50 p-5 sm:p-10 shadow-[4px_4px_0_#181817] sm:shadow-[6px_6px_0_#181817]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-[#181817] bg-[#181817] font-serif text-2xl font-bold text-[#f4f0e9]">
                RW<span className="text-[#e85d3f]">.</span>
              </div>
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
                  O autorze
                </span>
                <h3 className="mt-1 font-serif text-2xl font-bold">Rafał Wielgus</h3>
                <p className="mt-2 font-sans text-sm leading-6 text-[#514f49]">
                  Technik elektronik, pasjonat procesów, automatyki przemysłowej i AI w branży recyklingu. Po twardej lekcji bankructwa i korporacyjnej szkole jakości pisze o łączeniu techniki z psychologią oraz idei Long-Life Learning.
                </p>
                <div className="mt-4">
                  <Link
                    href="/o-mnie"
                    className="font-sans text-xs font-bold uppercase tracking-wider text-[#181817] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#e85d3f]"
                  >
                    Poznaj całą moją historię &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sekcja: Przeczytaj również (Dwie propozycje powiązanych esejów) */}
          <RelatedPosts posts={relatedPosts} />

          {/* Newsletter Box */}
          <div className="mx-auto mt-14 max-w-3xl">
            <NewsletterBox source={`post-${post.slug}`} />
          </div>

          {/* Sekcja Komentarzy i Dyskusji */}
          <CommentsSection postSlug={post.slug} />
        </article>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
