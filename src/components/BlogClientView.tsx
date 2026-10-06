'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import NewsletterBox from '@/components/NewsletterBox';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags?: string;
  seoDescription?: string;
  thumbnailUrl?: string;
  createdAt: string;
  isScheduled?: boolean;
}

const CATEGORIES = [
  'Wszystkie',
  'Psychologia',
  'Technologia',
  'Biznes',
  'Automatyka & AI',
  'Rozwój',
  'Jakość & Procesy',
];

function formatPolishDateWithWeekday(dateStr: string): string {
  const d = new Date(dateStr);
  const weekday = d.toLocaleDateString('pl-PL', { weekday: 'long' });
  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const day = d.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return `${capitalizedWeekday}, ${day}`;
}

export default function BlogClientView({ initialPosts }: { initialPosts: Post[] }) {
  const [posts] = useState<Post[]>(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');
  const [activeTab, setActiveTab] = useState<'published' | 'scheduled' | 'all'>('published');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      if (tab === 'scheduled' || tab === 'all' || tab === 'published') {
        setActiveTab(tab);
      }
    }
  }, []);

  const handleTabChange = (tab: 'published' | 'scheduled' | 'all') => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (tab === 'published') {
        url.searchParams.delete('tab');
      } else {
        url.searchParams.set('tab', tab);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  // Segregacja postów na opublikowane i zaplanowane
  const { publishedPosts, scheduledPosts } = useMemo(() => {
    const now = new Date().getTime();
    const pub: Post[] = [];
    const sched: Post[] = [];

    posts.forEach((post) => {
      const isSched = post.isScheduled ?? new Date(post.createdAt).getTime() > now;
      if (isSched) {
        sched.push({ ...post, isScheduled: true });
      } else {
        pub.push({ ...post, isScheduled: false });
      }
    });

    pub.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    sched.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    return { publishedPosts: pub, scheduledPosts: sched };
  }, [posts]);

  // Filtrowanie według wybranej kategorii i aktywnej zakładki
  const currentList = useMemo(() => {
    let source: Post[] = [];
    if (activeTab === 'published') source = publishedPosts;
    else if (activeTab === 'scheduled') source = scheduledPosts;
    else source = [...publishedPosts, ...scheduledPosts];

    if (selectedCategory === 'Wszystkie') return source;
    return source.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [activeTab, publishedPosts, scheduledPosts, selectedCategory]);

  const nextScheduledPost = scheduledPosts.length > 0 ? scheduledPosts[0] : null;

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-[#181817] py-14 sm:py-20">
        <div className="max-w-4xl">
          <p className="mb-6 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#e85d3f]">
            02 / Notatnik & Artykuły
          </p>
          <h1 className="font-serif text-[clamp(2.75rem,7vw,6rem)] font-black leading-[0.92] tracking-[-0.05em]">
            Myśli, eseje i obserwacje z pierwszej linii.
          </h1>
          <p className="mt-8 max-w-2xl font-sans text-lg leading-8 text-[#514f49] sm:text-xl">
            O psychologii decyzji, nowoczesnej technologii, automatyzacji i rzemiośle pracy. Nowe eseje ukazują się cyklicznie w każdy <strong>wtorek i czwartek o 09:00</strong>.
          </p>
        </div>

        {/* Publishing Cadence Box */}
        <div className="mt-10 flex flex-col justify-between gap-5 border border-[#181817] bg-[#ede7dc]/50 p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <span className="mt-1 flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e85d3f] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#e85d3f]"></span>
            </span>
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                Rytm wydawniczy: Wtorki & Czwartki &bull; 09:00
              </p>
              <p className="mt-1 font-sans text-sm text-[#514f49]">
                Artykuły publikowane są zgodnie z kalendarzem. Aktualnie dostępnych:{' '}
                <strong className="text-[#181817]">{publishedPosts.length}</strong> esejów, kolejnych{' '}
                <strong className="text-[#181817]">{scheduledPosts.length}</strong> zaplanowanych w kolejce.
              </p>
            </div>
          </div>

          {nextScheduledPost && (
            <div className="border-t border-[#181817]/20 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#e85d3f]">
                Najbliższa premiera:
              </span>
              <p className="font-serif text-base font-bold text-[#181817]">
                {formatPolishDateWithWeekday(nextScheduledPost.createdAt)}
              </p>
              <button
                onClick={() => handleTabChange('scheduled')}
                className="mt-1 inline-block font-sans text-xs font-bold text-[#e85d3f] underline hover:text-[#181817]"
              >
                Zobacz harmonogram &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Tab Selector & Categories */}
        <div className="mt-12 space-y-6">
          {/* View Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#181817]/20 pb-4">
            <span className="mr-3 font-sans text-xs font-bold uppercase tracking-widest text-[#514f49]">
              Widok:
            </span>
            <button
              onClick={() => handleTabChange('published')}
              className={`px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'published'
                  ? 'bg-[#181817] text-white shadow-[3px_3px_0_#e85d3f]'
                  : 'border border-[#181817]/40 bg-transparent text-[#181817] hover:border-[#181817]'
              }`}
            >
              Opublikowane ({publishedPosts.length})
            </button>

            <button
              onClick={() => handleTabChange('scheduled')}
              className={`px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'scheduled'
                  ? 'bg-[#181817] text-white shadow-[3px_3px_0_#e85d3f]'
                  : 'border border-[#181817]/40 bg-transparent text-[#181817] hover:border-[#e85d3f] hover:text-[#e85d3f]'
              }`}
            >
              Harmonogram premier ({scheduledPosts.length})
            </button>

            <button
              onClick={() => handleTabChange('all')}
              className={`px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'all'
                  ? 'bg-[#181817] text-white shadow-[3px_3px_0_#e85d3f]'
                  : 'border border-[#181817]/40 bg-transparent text-[#514f49] hover:border-[#181817] hover:text-[#181817]'
              }`}
            >
              Wszystkie ({posts.length})
            </button>
          </div>

          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <span className="mr-2 font-sans text-xs font-bold uppercase tracking-widest text-[#514f49]">
              Kategoria:
            </span>
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 font-sans text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#e85d3f] text-white'
                      : 'border border-[#181817]/30 bg-transparent text-[#514f49] hover:border-[#181817] hover:text-[#181817]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-14 sm:py-20">
        {currentList.length === 0 ? (
          <div className="border border-[#181817] bg-[#ede7dc]/40 p-12 text-center sm:p-16">
            <p className="font-serif text-2xl font-bold sm:text-3xl">Brak artykułów w tym widoku</p>
            <p className="mt-3 font-sans text-sm text-[#514f49]">
              {activeTab === 'scheduled'
                ? 'Brak zaplanowanych publikacji dla wybranej kategorii.'
                : 'Nie znaleziono opublikowanych artykułów w wybranej kategorii.'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Wszystkie');
                setActiveTab('published');
              }}
              className="mt-6 bg-[#181817] px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-[#e85d3f]"
            >
              Pokaż wszystkie opublikowane
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {currentList.map((post) => {
              const readingTime = Math.max(
                1,
                Math.ceil(post.content.trim().split(/\s+/).length / 200)
              );
              const isSched = post.isScheduled;

              return (
                <article
                  key={post.id}
                  className={`group relative border transition-all ${
                    isSched
                      ? 'border-[#e85d3f]/40 bg-[#ede7dc]/25 p-6 sm:p-10'
                      : 'border-[#181817] bg-[#ede7dc]/40 p-6 shadow-[6px_6px_0_#181817] hover:-translate-y-1 hover:shadow-[10px_10px_0_#e85d3f] sm:p-10'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#181817]/15 pb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`font-sans text-xs font-bold uppercase tracking-wider ${
                          isSched ? 'text-[#e85d3f]' : 'text-[#181817]'
                        }`}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs text-[#514f49]">&bull;</span>
                      <span className="font-sans text-xs text-[#514f49]">
                        {isSched ? 'Planowana data: ' : ''}
                        {formatPolishDateWithWeekday(post.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isSched ? (
                        <span className="border border-[#e85d3f] bg-[#e85d3f]/10 px-2.5 py-0.5 font-sans text-[11px] font-bold uppercase tracking-wider text-[#e85d3f]">
                          Zapowiedź
                        </span>
                      ) : (
                        <span className="font-sans text-xs text-[#514f49]">
                          ~{readingTime} min czytania
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h2 className="font-serif text-2xl font-black leading-tight tracking-tight sm:text-4xl">
                      {isSched ? (
                        <span className="text-[#181817]">{post.title}</span>
                      ) : (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition-colors hover:text-[#e85d3f]"
                        >
                          {post.title}
                        </Link>
                      )}
                    </h2>

                    <p className="mt-4 font-sans text-base leading-7 text-[#514f49] sm:text-lg">
                      {post.seoDescription ||
                        post.content.slice(0, 220).replace(/[#*`_]/g, '') + '...'}
                    </p>

                    {post.tags && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {post.tags.split(',').map((tag) => (
                          <span
                            key={tag.trim()}
                            className="bg-[#181817]/5 px-2.5 py-1 font-sans text-[11px] text-[#514f49]"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-8 flex items-center justify-between">
                      {isSched ? (
                        <div className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">
                          <span>🔒 Pełny esej w dniu premiery</span>
                        </div>
                      ) : (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-2 bg-[#181817] px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#e85d3f]"
                        >
                          Czytaj esej <span className="text-white">&rarr;</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Newsletter Box */}
        <NewsletterBox className="my-16" />
      </section>
    </div>
  );
}
