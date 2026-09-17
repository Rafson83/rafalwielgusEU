'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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
  seoTitle?: string;
  seoDescription?: string;
  thumbnailUrl?: string;
  createdAt: string;
  isScheduled?: boolean;
}

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

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('preview') === 'true' || urlParams.get('admin') === 'true') {
        setPreviewMode(true);
      }
    }
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
          document.title = data.seoTitle || `${data.title} — Rafał Wielgus`;

          if (data.seoDescription) {
            let description = document.querySelector('meta[name="description"]');
            if (!description) {
              description = document.createElement('meta');
              description.setAttribute('name', 'description');
              document.head.appendChild(description);
            }
            description.setAttribute('content', data.seoDescription);
          }

          if (data.thumbnailUrl) {
            let image = document.querySelector('meta[property="og:image"]');
            if (!image) {
              image = document.createElement('meta');
              image.setAttribute('property', 'og:image');
              document.head.appendChild(image);
            }
            image.setAttribute('content', data.thumbnailUrl);
          }
        }
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) {
      fetchPost();
    }
  }, [params.slug]);

  const readingTime = post
    ? Math.max(1, Math.ceil(post.content.trim().split(/\s+/).length / 200))
    : 1;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
        <div className="mx-auto max-w-7xl px-5 py-24 text-center sm:px-8">
          <div className="inline-block h-8 w-8 animate-spin border-4 border-[#181817] border-t-[#e85d3f]"></div>
          <p className="mt-4 font-sans text-sm font-bold uppercase tracking-widest text-[#514f49]">
            Wczytywanie artykułu...
          </p>
        </div>
      </main>
    );
  }

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

          <div className="mx-auto my-12 max-w-4xl border border-[#181817] bg-[#ede7dc]/60 p-8 sm:p-14 shadow-[10px_10px_0_#181817]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#181817] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
                Zaplanowana premiera
              </span>
              <span className="bg-[#e85d3f] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
                {post.category}
              </span>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#514f49]">
                Rytm wydawniczy: Wtorki & Czwartki
              </span>
            </div>

            <h1 className="mt-6 font-serif text-[clamp(2.2rem,5vw,3.75rem)] font-black leading-[0.98] tracking-[-0.04em]">
              {post.title}
            </h1>

            <div className="mt-6 inline-flex flex-wrap items-center gap-3 border border-[#181817] bg-white px-4 py-3 shadow-[4px_4px_0_#181817]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e85d3f] animate-pulse"></span>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                Premiera: <strong>{formatPolishDateWithWeekday(post.createdAt)}</strong> o godz. <strong>09:00</strong>
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
              <button
                onClick={() => setPreviewMode(true)}
                className="ml-auto font-sans text-xs font-bold text-[#514f49] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#e85d3f]"
              >
                Podgląd roboczy (dla autora)
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Navbar />

        {/* Tryb podglądu dla zaplanowanego wpisu */}
        {post.isScheduled && previewMode && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-[#e85d3f] bg-[#ede7dc] p-4 font-sans text-xs font-bold uppercase tracking-wider text-[#181817] shadow-[4px_4px_0_#e85d3f]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#e85d3f] animate-ping"></span>
              <span>Tryb podglądu roboczego &bull; Premiera czytelnicza: {formatPolishDateWithWeekday(post.createdAt)} o 09:00</span>
            </div>
            <button
              onClick={() => setPreviewMode(false)}
              className="underline decoration-[#e85d3f] underline-offset-2 hover:text-[#e85d3f]"
            >
              Zamknij podgląd roboczy &times;
            </button>
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

            <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.95] tracking-[-0.04em] text-balance">
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
            <div className="mx-auto my-12 max-w-4xl overflow-hidden border border-[#181817] shadow-[10px_10px_0_#181817]">
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                className="max-h-[520px] w-full object-cover"
              />
            </div>
          )}

          {/* Article Content Body */}
          <div className="mx-auto mt-12 max-w-3xl font-serif text-lg leading-[1.85] text-[#181817] sm:text-xl sm:leading-[1.9]">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (index === 0) {
                return (
                  <p
                    key={index}
                    className="mb-8 first-letter:float-left first-letter:mr-4 first-letter:font-serif first-letter:text-6xl first-letter:font-black first-letter:leading-[0.8] first-letter:text-[#181817]"
                  >
                    {paragraph}
                  </p>
                );
              }
              return (
                <p key={index} className="mb-8">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Author Box */}
          <div className="mx-auto mt-16 max-w-3xl border border-[#181817] bg-[#ede7dc]/50 p-8 sm:p-10 shadow-[6px_6px_0_#181817]">
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

          {/* Newsletter Box */}
          <div className="mx-auto mt-14 max-w-3xl">
            <NewsletterBox source={`post-${post.slug}`} />
          </div>
        </article>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
