'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] text-[#1c1917] flex items-center justify-center font-sans">
        Drukujemy artykuł...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#faf6f0] text-[#1c1917] flex flex-col items-center justify-center font-serif p-4">
        <h1 className="text-3xl font-black mb-4">404 - Artykuł nie odnaleziony</h1>
        <p className="font-sans text-sm text-stone-600 mb-6">Wygląda na to, że ten artykuł nie został jeszcze wydrukowany.</p>
        <Link href="/blog" className="font-sans text-xs uppercase font-bold border border-[#1c1917] px-4 py-2 hover:bg-[#1c1917] hover:text-white transition-all">
          Powrót do strony głównej
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#1c1917] px-4 md:px-8 py-10 font-serif selection:bg-[#fbbf24]">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <nav className="mb-8 pb-4 border-b border-[#1c1917]/20 flex justify-between items-center text-xs font-sans uppercase font-bold tracking-widest text-stone-600">
          <Link href="/blog" className="hover:text-amber-800 transition-colors">
            &larr; Powrót do wydania
          </Link>
          <span>Dział: {post.category}</span>
        </nav>

        {/* Newspaper Article Header */}
        <article className="space-y-8">
          <header className="text-center space-y-4">
            <span className="font-sans text-xs font-black uppercase text-amber-800 tracking-wider">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-balance">
              {post.title}
            </h1>
            <div className="flex justify-center items-center gap-4 text-xs font-sans text-stone-500 uppercase tracking-wider">
              <span>Rafał Wielgus</span>
              <span>&bull;</span>
              <span>{new Date(post.createdAt).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="w-24 h-1 bg-[#1c1917] mx-auto mt-6" />
          </header>

          {/* Newspaper content simulation with columns */}
          <div className="text-base md:text-lg text-stone-800 leading-relaxed text-justify space-y-6 md:columns-2 md:gap-8 pt-4 border-t border-[#1c1917]/10">
            {post.content.split('\n\n').map((paragraph, index) => {
              if (index === 0) {
                return (
                  <p key={index} className="first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#1c1917] first-letter:leading-[0.8]">
                    {paragraph}
                  </p>
                );
              }
              return (
                <p key={index} className="indent-6">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t-[3px] border-double border-[#1c1917] text-center font-sans text-xs text-stone-500 uppercase tracking-widest">
          Koniec artykułu &bull; rafalwielgus.eu
        </footer>
      </div>
    </div>
  );
}
