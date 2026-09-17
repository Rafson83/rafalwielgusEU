'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
  tags?: string;
  published: boolean;
  createdAt: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  techStack: string;
  link?: string;
}

interface ProductItem {
  id: string;
  slug: string;
  title: string;
  headline: string;
  tagline: string;
  category: string;
  status: string;
  statusLabel: string;
  price: string;
  priceNote?: string;
  badge: string;
  description: string;
  isFlagship?: boolean;
  isDraft?: boolean;
  modules?: { number: string; title: string; lessons: string[] }[];
  outcomes?: { title: string; description: string }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'projects' | 'products'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  
  // Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [postCategory, setPostCategory] = useState('psychologia');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('');
  const [postSeoTitle, setPostSeoTitle] = useState('');
  const [postSeoDescription, setPostSeoDescription] = useState('');
  const [postThumbnailUrl, setPostThumbnailUrl] = useState('');
  const [postPublished, setPostPublished] = useState(false);

  // Project Form State
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectLink, setProjectLink] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch list of current posts/projects/products
  const fetchData = async () => {
    try {
      const postsRes = await fetch('/api/posts');
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
      const projRes = await fetch('/api/projects');
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData);
      }
      const prodRes = await fetch('/api/products?all=true');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const handleProductStatusChange = async (slug: string, newStatus: string) => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Nie udało się zmienić statusu');

      setMessage({
        text: `Status produktu zaktualizowany na: "${newStatus}".`,
        type: 'success',
      });
      await fetchData();
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : 'Błąd zapisu statusu',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchData();
    };

    void loadData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  // Helper auto-slug generator
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPostTitle(val);
    // basic slugify
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setPostSlug(generatedSlug);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: postTitle,
          slug: postSlug,
          content: postContent,
          category: postCategory,
          tags: postTags,
          seoTitle: postSeoTitle,
          seoDescription: postSeoDescription,
          thumbnailUrl: postThumbnailUrl,
          published: postPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Nie udało się dodać artykułu');

      setMessage({ text: 'Artykuł został pomyślnie dodany!', type: 'success' });
      setPostTitle('');
      setPostSlug('');
      setPostContent('');
      setPostTags('');
      setPostSeoTitle('');
      setPostSeoDescription('');
      setPostThumbnailUrl('');
      setPostPublished(false);
      fetchData();
    } catch (err: unknown) {
      setMessage({ text: err instanceof Error ? err.message : 'Nie udało się dodać artykułu', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          description: projectDesc,
          techStack: projectTech,
          link: projectLink || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Nie udało się dodać projektu');

      setMessage({ text: 'Projekt został pomyślnie dodany!', type: 'success' });
      setProjectName('');
      setProjectDesc('');
      setProjectTech('');
      setProjectLink('');
      fetchData();
    } catch (err: unknown) {
      setMessage({ text: err instanceof Error ? err.message : 'Nie udało się dodać projektu', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center pb-6 border-b border-white/[0.08] mb-8">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Kokpit Administratora
            </h1>
            <p className="text-sm text-gray-400">rafalwielgus.eu admin tools</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 active:scale-[0.98] transition-all text-sm font-semibold"
          >
            Wyloguj
          </button>
        </header>

        {/* Status Messages */}
        {message.text && (
          <div
            className={`py-3 px-4 rounded-xl mb-6 border text-sm ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tab selector */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => { setActiveTab('posts'); setMessage({ text: '', type: '' }); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeTab === 'posts'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                : 'bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-white'
            }`}
          >
            Wpisy (Blog)
          </button>
          <button
            onClick={() => { setActiveTab('projects'); setMessage({ text: '', type: '' }); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              activeTab === 'projects'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                : 'bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-white'
            }`}
          >
            Projekty
          </button>
          <button
            onClick={() => { setActiveTab('products'); setMessage({ text: '', type: '' }); }}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                : 'bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-white'
            }`}
          >
            <span>Produkty & Szkice Kursów</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {products.filter((p) => p.status === 'Szkic' || p.isDraft).length} szkice
            </span>
          </button>
        </div>

        {/* Forms & Lists Grid */}
        {activeTab === 'products' ? (
          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span>Katalog Kursów, Produktów & Kampanii Startowych</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
                    Szablony ze statusem <span className="text-amber-400 font-semibold">🔒 Szkic</span> są ukryte przed czytelnikami w katalogu publicznym. Kiedy zdecydujesz się wystartować z kampanią danego kursu, przełącz jego status na <span className="text-sky-400 font-semibold">🚀 W przygotowaniu</span>, a strona natychmiast pojawi się na blogu i umożliwi zbieranie zapisów na listę oczekujących.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">
                    Wszystkich: <strong className="text-white">{products.length}</strong>
                  </span>
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    Szkice (ukryte): <strong className="text-amber-200">{products.filter((p) => p.status === 'Szkic' || p.isDraft).length}</strong>
                  </span>
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    Widoczne na blogu: <strong className="text-emerald-200">{products.filter((p) => p.status !== 'Szkic' && !p.isDraft).length}</strong>
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((prod) => {
                  const isDraft = prod.status === 'Szkic' || prod.isDraft;
                  return (
                    <div
                      key={prod.id}
                      className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                        isDraft
                          ? 'bg-amber-950/10 border-amber-500/30 hover:border-amber-500/50'
                          : 'bg-white/[0.02] border-white/[0.08] hover:border-indigo-500/40'
                      }`}
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                                isDraft
                                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                  : prod.status === 'W przygotowaniu'
                                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                                  : prod.status === 'W realizacji'
                                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              }`}
                            >
                              {isDraft ? '🔒 Szkic (Ukryty)' : `🚀 ${prod.status}`}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-gray-400 bg-white/5 px-2 py-1 rounded">
                              {prod.category}
                            </span>
                            {prod.isFlagship && (
                              <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                                Flagowy
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono font-bold text-gray-300">
                            {prod.price}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1">
                          {prod.title}
                        </h3>
                        <p className="text-xs italic text-gray-400 mb-3">
                          „{prod.headline}”
                        </p>
                        <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">
                          {prod.description}
                        </p>

                        {prod.modules && prod.modules.length > 0 && (
                          <div className="border-t border-white/5 pt-3 mb-4">
                            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                              Struktura programu ({prod.modules.length} moduły):
                            </p>
                            <ul className="space-y-1">
                              {prod.modules.map((m) => (
                                <li key={m.number} className="text-[11px] text-gray-400 flex items-center gap-2 truncate">
                                  <span className="font-mono text-gray-500">[{m.number}]</span>
                                  <span className="truncate">{m.title}</span>
                                  <span className="text-[10px] text-gray-500">({m.lessons.length} lekcji)</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-[11px] text-gray-400 font-semibold">Status:</label>
                          <select
                            value={prod.status}
                            onChange={(e) => handleProductStatusChange(prod.slug, e.target.value)}
                            disabled={loading}
                            className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"
                          >
                            <option value="Szkic" className="bg-[#111827] text-amber-300">🔒 Szkic (Ukryty)</option>
                            <option value="W przygotowaniu" className="bg-[#111827] text-sky-300">🚀 W przygotowaniu (Katalog)</option>
                            <option value="W realizacji" className="bg-[#111827] text-indigo-300">⏳ W realizacji</option>
                            <option value="Dostępny" className="bg-[#111827] text-emerald-300">✅ Dostępny</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`/produkty/${prod.slug}?preview=admin`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-all flex items-center gap-1.5"
                          >
                            <span>👁</span>
                            <span>Podgląd</span>
                          </a>

                          {isDraft ? (
                            <button
                              onClick={() => handleProductStatusChange(prod.slug, 'W przygotowaniu')}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all flex items-center gap-1"
                            >
                              <span>🚀</span>
                              <span>Wystartuj kampanię</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleProductStatusChange(prod.slug, 'Szkic')}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-all"
                            >
                              Ukryj do szkiców
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Creator Form */}
          <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl">
            {activeTab === 'posts' ? (
              <form onSubmit={handleCreatePost} className="space-y-6">
                <h2 className="text-xl font-bold border-b border-white/5 pb-2">Dodaj nowy artykuł</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Tytuł wpisu</label>
                    <input
                      type="text"
                      value={postTitle}
                      onChange={handleTitleChange}
                      required
                      placeholder="Wprowadź tytuł"
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      value={postSlug}
                      onChange={(e) => setPostSlug(e.target.value)}
                      required
                      placeholder="slug-artykulu"
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Kategoria</label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full bg-[#0b0f19] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                    >
                      <option value="psychologia">Psychologia</option>
                      <option value="technologia">Technologia</option>
                      <option value="praca">Praca</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-8">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postPublished}
                        onChange={(e) => setPostPublished(e.target.checked)}
                        className="w-4 h-4 rounded border-white/[0.08] bg-white/[0.02] text-indigo-600 focus:ring-0"
                      />
                      <span className="text-sm text-gray-300">Opublikuj od razu</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Treść (Markdown / HTML)</label>
                  <textarea
                    rows={12}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                    placeholder="Wpisz treść artykułu..."
                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 text-sm focus:border-indigo-500 outline-none text-white transition-all font-mono"
                  />
                </div>

                <div className="border-t border-white/5 pt-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Widoczność w wyszukiwarce</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Tagi</label>
                      <input
                        type="text"
                        value={postTags}
                        onChange={(e) => setPostTags(e.target.value)}
                        placeholder="np. skupienie, rozwój, praca"
                        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                      />
                      <p className="mt-2 text-[11px] text-gray-500">Oddziel tagi przecinkami.</p>
                    </div>
                    <div>
                      <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Miniaturka (URL)</label>
                      <input
                        type="url"
                        value={postThumbnailUrl}
                        onChange={(e) => setPostThumbnailUrl(e.target.value)}
                        placeholder="https://.../obrazek.jpg"
                        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">SEO title</label>
                      <input
                        type="text"
                        value={postSeoTitle}
                        onChange={(e) => setPostSeoTitle(e.target.value)}
                        maxLength={255}
                        placeholder="Tytuł widoczny w Google"
                        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">SEO description</label>
                      <textarea
                        rows={3}
                        value={postSeoDescription}
                        onChange={(e) => setPostSeoDescription(e.target.value)}
                        placeholder="Krótki opis wyniku wyszukiwania"
                        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 text-sm focus:border-indigo-500 outline-none text-white transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-sm shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? 'Dodawanie...' : 'Dodaj artykuł'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateProject} className="space-y-6">
                <h2 className="text-xl font-bold border-b border-white/5 pb-2">Dodaj nowy projekt</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Nazwa projektu</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                      placeholder="Wprowadź nazwę"
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Stos technologiczny</label>
                    <input
                      type="text"
                      value={projectTech}
                      onChange={(e) => setProjectTech(e.target.value)}
                      required
                      placeholder="React, Next.js, Prisma"
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Link zewnętrzny (GitHub / Live Demo)</label>
                  <input
                    type="url"
                    value={projectLink}
                    onChange={(e) => setProjectLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Opis projektu</label>
                  <textarea
                    rows={6}
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    required
                    placeholder="Opisz krótko swój projekt..."
                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold text-sm shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {loading ? 'Dodawanie...' : 'Dodaj projekt'}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar / List View */}
          <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-bold border-b border-white/5 pb-2 mb-4">
              {activeTab === 'posts' ? 'Istniejące wpisy' : 'Zapisane projekty'}
            </h2>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {activeTab === 'posts' ? (
                posts.length === 0 ? (
                  <p className="text-sm text-gray-500">Brak artykułów w bazie.</p>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl hover:border-indigo-500/30 transition-all">
                      <h3 className="font-semibold text-sm truncate">{post.title}</h3>
                      <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500">
                        <span>{post.category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                          post.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {post.published ? 'Publikacja' : 'Szkic'}
                        </span>
                      </div>
                    </div>
                  ))
                )
              ) : (
                projects.length === 0 ? (
                  <p className="text-sm text-gray-500">Brak projektów w bazie.</p>
                ) : (
                  projects.map((proj) => (
                    <div key={proj.id} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl">
                      <h3 className="font-semibold text-sm truncate">{proj.name}</h3>
                      <p className="text-[11px] text-gray-500 mt-1 truncate">{proj.techStack}</p>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </main>
  );
}
