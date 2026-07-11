'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  createdAt: string;
}

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
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

  return (
    <div className="min-h-screen bg-[#faf6f0] text-[#1c1917] px-4 md:px-8 py-10 font-serif selection:bg-[#fbbf24]">
      <div className="max-w-6xl mx-auto">
        {/* Newspaper Header */}
        <header className="text-center mb-8">
          <div className="border-b-[4px] border-[#1c1917] pb-4">
            <h1 className="font-serif text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-2">
              Głos Milenialsa
            </h1>
            <p className="font-serif italic text-lg text-stone-600">
              „Najbardziej wykształcone pokolenie, które wreszcie przestało się bać opini innych”
            </p>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b-[1px] border-[#1c1917] text-xs font-sans uppercase font-bold tracking-widest text-stone-600">
            <span>Rok I &bull; Wydanie 1</span>
            <span>{new Date().toLocaleDateString('pl-PL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>Cena: Bezcenne (Wiedza & Doświadczenie)</span>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-20 font-sans text-stone-500">
            Drukujemy wydanie... Proszę czekać.
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 border-[3px] border-double border-[#1c1917] p-8">
            <h3 className="text-2xl font-bold mb-2">Pierwszy numer w przygotowaniu</h3>
            <p className="font-sans text-sm text-stone-600">
              Redakcja pracuje nad artykułami z zakresu psychologii, biznesu i technologii. Pierwsze teksty pojawią się już niebawem!
            </p>
            <div className="mt-6">
              <Link href="/admin" className="font-sans text-xs uppercase font-bold border border-[#1c1917] px-4 py-2 hover:bg-[#1c1917] hover:text-white transition-all">
                Przejdź do Kokpitu Redaktora &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Lead Story (Artykuł główny - zajmuje 2 kolumny) */}
            <div className="md:col-span-2 border-r-0 md:border-r border-[#1c1917]/20 pr-0 md:pr-8 space-y-6">
              {posts.slice(0, 1).map((post) => (
                <article key={post.id} className="space-y-4">
                  <div className="space-y-2">
                    <span className="font-sans text-xs font-black uppercase text-amber-800 tracking-wider">
                      Główny temat: {post.category}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold leading-none hover:text-amber-800 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="font-sans text-xs text-stone-500">
                      Opublikowano: {new Date(post.createdAt).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                  
                  {/* Dynamic newspaper column simulator */}
                  <div className="font-serif text-base text-stone-800 leading-relaxed text-justify space-y-4 md:columns-2 md:gap-6 border-t border-[#1c1917]/10 pt-4">
                    <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#1c1917] first-letter:leading-[0.8]">
                      {post.content.length > 500 ? post.content.substring(0, 500) + '...' : post.content}
                    </p>
                    <div className="mt-4">
                      <Link href={`/blog/${post.slug}`} className="font-sans text-xs uppercase font-bold border-b-2 border-[#1c1917] hover:text-amber-800 hover:border-amber-800 transition-all inline-block">
                        Czytaj cały artykuł &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Side column (Kolejne artykuły jako mniejsze kolumny w gazecie) */}
            <div className="space-y-8">
              <h3 className="font-sans text-xs font-black uppercase tracking-widest border-b-[3px] border-[#1c1917] pb-1 mb-4">
                W tym numerze również
              </h3>
              
              {posts.slice(1).length === 0 ? (
                <p className="text-xs italic text-stone-500 font-sans">Brak dodatkowych artykułów w tym wydaniu.</p>
              ) : (
                posts.slice(1).map((post) => (
                  <article key={post.id} className="border-b border-[#1c1917]/10 pb-6 last:border-b-0 space-y-2">
                    <span className="font-sans text-[10px] font-bold uppercase text-stone-600">
                      {post.category}
                    </span>
                    <h4 className="text-xl font-bold leading-tight hover:text-amber-800 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h4>
                    <p className="text-sm text-stone-700 text-justify leading-relaxed line-clamp-3">
                      {post.content.replace(/<[^>]*>/g, '')}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="font-sans text-[11px] font-bold underline hover:text-amber-800 block pt-1">
                      Czytaj dalej
                    </Link>
                  </article>
                ))
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
