'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import NewsletterBox from '@/components/NewsletterBox';
import Footer from '@/components/Footer';

interface Post {
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

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts?includeScheduled=true');
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

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
    <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Navbar />

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
          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block h-8 w-8 animate-spin border-4 border-[#181817] border-t-[#e85d3f]"></div>
              <p className="mt-4 font-sans text-sm font-bold uppercase tracking-widest text-[#514f49]">
                Wczytywanie artykułów...
              </p>
            </div>
          ) : currentList.length === 0 ? (
            <div className="border border-[#181817] bg-[#ede7dc]/40 p-10 text-center sm:p-16">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
                Status Redakcji
              </span>
              <h3 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                {activeTab === 'published'
                  ? `Brak opublikowanych wpisów w kategorii „${selectedCategory}”`
                  : `Brak zaplanowanych wpisów w kategorii „${selectedCategory}”`}
              </h3>
              <p className="mx-auto mt-4 max-w-xl font-sans text-base leading-7 text-[#514f49]">
                {activeTab === 'published' && scheduledPosts.length > 0
                  ? 'Kolejne artykuły z tego obszaru znajdują się w harmonogramie premier. Sprawdź zakładkę „Harmonogram premier”, aby zobaczyć terminy kolejnych publikacji.'
                  : 'Wybierz inną kategorię lub wróć do wszystkich wpisów.'}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {activeTab === 'published' && scheduledPosts.length > 0 && (
                  <button
                    onClick={() => setActiveTab('scheduled')}
                    className="bg-[#181817] px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#e85d3f]"
                  >
                    Przejdź do harmonogramu premier &rarr;
                  </button>
                )}
                {selectedCategory !== 'Wszystkie' && (
                  <button
                    onClick={() => setSelectedCategory('Wszystkie')}
                    className="border border-[#181817] px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider transition-all hover:bg-[#181817] hover:text-white"
                  >
                    Pokaż wszystkie kategorie
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {/* If Active Tab is SCHEDULED: Dedicated Editorial Timeline View */}
              {activeTab === 'scheduled' ? (
                <div className="space-y-8">
                  <div className="border-b border-[#181817] pb-4">
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
                      Harmonogram Premier &bull; Cykl wtorkowo-czwartkowy
                    </p>
                    <h2 className="mt-2 font-serif text-3xl font-black tracking-tight">
                      Nadchodzące publikacje (godz. 09:00)
                    </h2>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {currentList.map((post, idx) => (
                      <article
                        key={post.id}
                        className="flex flex-col justify-between border-2 border-dashed border-[#181817] bg-[#ede7dc]/25 p-7 transition-all hover:border-solid hover:border-[#e85d3f] hover:bg-[#ede7dc]/50 hover:shadow-[6px_6px_0_#181817]"
                      >
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#181817]/20 pb-3">
                            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">
                              {formatPolishDateWithWeekday(post.createdAt)}
                            </span>
                            <span className="border border-[#e85d3f] bg-[#e85d3f]/10 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-[#e85d3f]">
                              Kolejka #{idx + 1}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center gap-2">
                            <span className="bg-[#181817] px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-white">
                              {post.category}
                            </span>
                            <span className="font-sans text-xs text-[#514f49]">
                              Premiera o 09:00
                            </span>
                          </div>

                          <h3 className="mt-4 font-serif text-2xl font-bold leading-tight tracking-tight">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="transition-colors hover:text-[#e85d3f]"
                            >
                              {post.title}
                            </Link>
                          </h3>

                          <p className="mt-4 line-clamp-3 font-sans text-sm leading-6 text-[#514f49]">
                            {post.seoDescription || post.content.replace(/<[^>]*>/g, '').slice(0, 180) + '...'}
                          </p>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-[#181817]/15 pt-4">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="inline-flex items-center font-sans text-xs font-bold uppercase tracking-wider text-[#181817] hover:text-[#e85d3f]"
                          >
                            Zobacz zapowiedź &rarr;
                          </Link>
                          <span className="font-sans text-[11px] text-[#514f49] italic">
                            Opublikowany w dniu premiery
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                /* Standard Editorial Articles View (Published or All) */
                <div className="space-y-16">
                  {/* Lead Article */}
                  {currentList.length > 0 && (
                    <article className="group grid gap-8 border border-[#181817] bg-[#ede7dc]/30 p-6 transition-all hover:border-[#e85d3f] hover:shadow-[8px_8px_0_#181817] sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-[#e85d3f] px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-wider text-white">
                              {currentList[0].category}
                            </span>
                            <span className="font-sans text-xs font-bold text-[#181817]">
                              {formatPolishDateWithWeekday(currentList[0].createdAt)}
                            </span>
                            {currentList[0].isScheduled && (
                              <span className="border border-[#e85d3f] bg-[#e85d3f]/10 px-2 py-0.5 font-sans text-[10px] font-bold uppercase text-[#e85d3f]">
                                Zaplanowany
                              </span>
                            )}
                          </div>

                          <h2 className="mt-6 font-serif text-3xl font-black leading-tight tracking-tight transition-colors group-hover:text-[#e85d3f] sm:text-5xl">
                            <Link href={`/blog/${currentList[0].slug}`}>
                              {currentList[0].title}
                            </Link>
                          </h2>

                          <p className="mt-5 line-clamp-4 font-sans text-base leading-7 text-[#514f49] sm:text-lg">
                            {currentList[0].content.replace(/<[^>]*>/g, '')}
                          </p>
                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-[#181817]/20 pt-5">
                          <Link
                            href={`/blog/${currentList[0].slug}`}
                            className="font-sans text-sm font-bold uppercase tracking-wider text-[#181817] transition-colors hover:text-[#e85d3f]"
                          >
                            {currentList[0].isScheduled ? 'Zobacz zapowiedź' : 'Czytaj cały artykuł'} <span className="ml-2 text-[#e85d3f]">&rarr;</span>
                          </Link>

                          {currentList[0].tags && (
                            <div className="hidden flex-wrap gap-2 font-sans text-[11px] text-[#514f49] sm:flex">
                              {currentList[0].tags
                                .split(',')
                                .slice(0, 3)
                                .map((tag) => (
                                  <span key={tag.trim()} className="border border-[#181817]/20 px-2 py-0.5">
                                    #{tag.trim()}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="hidden aspect-square flex-col justify-between border border-[#181817] bg-[#181817] p-8 text-[#f4f0e9] lg:flex">
                        <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
                          Główny esej
                        </span>
                        <p className="font-serif text-3xl font-bold leading-tight">
                          „Dobre pytania są warte więcej niż szybkie odpowiedzi.”
                        </p>
                        <span className="font-sans text-xs uppercase tracking-widest text-[#f4f0e9]/60">
                          Rafał Wielgus &bull; Wydanie cyfrowe
                        </span>
                      </div>
                    </article>
                  )}

                  {/* Grid of Other Articles */}
                  {currentList.length > 1 && (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                      {currentList.slice(1).map((post) => (
                        <article
                          key={post.id}
                          className="group flex flex-col justify-between border border-[#181817] bg-[#ede7dc]/20 p-6 transition-all hover:-translate-y-1 hover:border-[#e85d3f] hover:shadow-[6px_6px_0_#181817]"
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="font-sans uppercase tracking-wider text-[#e85d3f]">
                                {post.category}
                              </span>
                              {post.isScheduled && (
                                <span className="border border-[#e85d3f] px-1.5 py-0.5 text-[10px] text-[#e85d3f]">
                                  Zaplanowany
                                </span>
                              )}
                            </div>

                            <p className="mt-2 font-sans text-xs font-semibold text-[#514f49]">
                              {formatPolishDateWithWeekday(post.createdAt)}
                            </p>

                            <h3 className="mt-4 font-serif text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-[#e85d3f]">
                              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                            </h3>

                            <p className="mt-3 line-clamp-3 font-sans text-sm leading-6 text-[#514f49]">
                              {post.content.replace(/<[^>]*>/g, '')}
                            </p>
                          </div>

                          <div className="mt-6 border-t border-[#181817]/10 pt-4">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center font-sans text-xs font-bold uppercase tracking-wider text-[#181817] transition-colors hover:text-[#e85d3f]"
                            >
                              {post.isScheduled ? 'Zobacz zapowiedź' : 'Czytaj dalej'}{' '}
                              <span className="ml-1 text-[#e85d3f]">&rarr;</span>
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}

                  {/* Teaser for Upcoming Releases when browsing Published */}
                  {activeTab === 'published' && scheduledPosts.length > 0 && (
                    <div className="mt-16 border-t-2 border-[#181817] pt-10">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
                            Cykliczne premiery
                          </p>
                          <h3 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
                            Co przeczytasz w najbliższych dniach?
                          </h3>
                        </div>
                        <button
                          onClick={() => setActiveTab('scheduled')}
                          className="font-sans text-xs font-bold uppercase tracking-wider text-[#181817] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#e85d3f]"
                        >
                          Zobacz cały harmonogram ({scheduledPosts.length} tekstów) &rarr;
                        </button>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {scheduledPosts.slice(0, 3).map((sp) => (
                          <div
                            key={sp.id}
                            className="border border-[#181817]/30 bg-[#ede7dc]/40 p-5 transition-all hover:border-[#e85d3f]"
                          >
                            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#e85d3f]">
                              {formatPolishDateWithWeekday(sp.createdAt)}
                            </span>
                            <h4 className="mt-2 font-serif text-lg font-bold leading-snug">
                              <Link href={`/blog/${sp.slug}`} className="hover:text-[#e85d3f]">
                                {sp.title}
                              </Link>
                            </h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Newsletter Box */}
        <NewsletterBox className="my-16" />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
