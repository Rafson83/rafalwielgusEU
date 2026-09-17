'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export interface AdminPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
  thumbnailUrl?: string;
  published: boolean | number;
  createdAt: string;
  isScheduled?: boolean;
  postStatus: 'draft' | 'scheduled' | 'published';
  statusLabel: string;
}

export interface AdminProduct {
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
  modules?: { number: string; title: string; description?: string; lessons: string[] }[];
  outcomes?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  forWhom?: string[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'projects' | 'products'>('posts');
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Filtry i wyszukiwarka
  const [searchQuery, setSearchQuery] = useState('');
  const [postStatusFilter, setPostStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');

  // Formularze widoczność
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // Formularz nowego artykułu
  const [postTitle, setPostTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [postCategory, setPostCategory] = useState('Psychologia');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('');
  const [postSeoTitle, setPostSeoTitle] = useState('');
  const [postSeoDescription, setPostSeoDescription] = useState('');
  const [postThumbnailUrl, setPostThumbnailUrl] = useState('');
  const [postFormStatus, setPostFormStatus] = useState<'draft' | 'scheduled' | 'published'>('draft');
  const [postScheduledDate, setPostScheduledDate] = useState('');

  // Modal szybkiego podglądu (in-panel preview)
  const [previewModal, setPreviewModal] = useState<{
    type: 'post' | 'product';
    data: AdminPost | AdminProduct;
  } | null>(null);

  // Pobieranie danych
  const fetchData = async () => {
    try {
      const postsRes = await fetch('/api/posts?admin=true');
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
      const prodRes = await fetch('/api/products?all=true');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
    } catch (err) {
      console.error('Błąd pobierania danych dashboardu:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  // Helper generowania sluga
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPostTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setPostSlug(generatedSlug);
  };

  // Dodawanie nowego artykułu
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
          status: postFormStatus,
          scheduledDate: postFormStatus === 'scheduled' ? postScheduledDate : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Nie udało się dodać artykułu');

      setMessage({ text: 'Artykuł został pomyślnie utworzony!', type: 'success' });
      setPostTitle('');
      setPostSlug('');
      setPostContent('');
      setPostTags('');
      setPostSeoTitle('');
      setPostSeoDescription('');
      setPostThumbnailUrl('');
      setPostFormStatus('draft');
      setPostScheduledDate('');
      setShowNewPostForm(false);
      await fetchData();
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : 'Błąd dodawania artykułu',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Zmiana statusu artykułu (Szkic / Zapowiedź / Publikacja)
  const handlePostStatusChange = async (
    slug: string,
    newStatus: 'draft' | 'scheduled' | 'published',
    scheduledDate?: string
  ) => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, status: newStatus, scheduledDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Nie udało się zaktualizować statusu');

      const labelMap = {
        draft: 'Szkic (ukryty)',
        scheduled: 'Zapowiedź (zaplanowany na blogu)',
        published: 'Opublikowany (aktywny)',
      };
      setMessage({
        text: `Artykuł "${slug}" został ustawiony jako: ${labelMap[newStatus]}.`,
        type: 'success',
      });
      await fetchData();
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : 'Błąd zapisu',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Zmiana statusu produktu (przenoszenie między Projektami a Produktami)
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
      if (!res.ok) throw new Error(data.error || 'Nie udało się zmienić statusu produktu');

      const isNowProject = newStatus === 'Szkic';
      setMessage({
        text: isNowProject
          ? `Produkt przeniesiony do zakładki "Projekty" jako Szkic roboczy (ukryty przed czytelnikami).`
          : `Produkt przeniesiony do zakładki "Produkty" ze statusem "${newStatus}" i jest widoczny na blogu!`,
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

  // Podział produktów na Projekty (Szkice) oraz Produkty (Zapowiedzi & Aktywne)
  const projectDrafts = useMemo(() => {
    return products.filter((p) => p.status === 'Szkic' || p.isDraft);
  }, [products]);

  const activeProducts = useMemo(() => {
    return products.filter((p) => p.status !== 'Szkic' && !p.isDraft);
  }, [products]);

  // Filtrowanie wpisów
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Filtr statusu
      if (postStatusFilter === 'published' && post.postStatus !== 'published') return false;
      if (postStatusFilter === 'scheduled' && post.postStatus !== 'scheduled') return false;
      if (postStatusFilter === 'draft' && post.postStatus !== 'draft') return false;

      // Wyszukiwarka
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchCategory = post.category.toLowerCase().includes(q);
        const matchSlug = post.slug.toLowerCase().includes(q);
        return matchTitle || matchCategory || matchSlug;
      }
      return true;
    });
  }, [posts, postStatusFilter, searchQuery]);

  // Statystyki wpisów
  const postStats = useMemo(() => {
    const published = posts.filter((p) => p.postStatus === 'published').length;
    const scheduled = posts.filter((p) => p.postStatus === 'scheduled').length;
    const drafts = posts.filter((p) => p.postStatus === 'draft').length;
    return { total: posts.length, published, scheduled, drafts };
  }, [posts]);

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center pb-6 border-b border-white/[0.08] mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Kokpit Twórcy & Administratora
              </h1>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                RW. Workshop v2.0
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Zarządzanie esejami, harmonogramem publikacji, inkubatorem projektów i produktami cyfrowymi
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white/[0.03] border border-white/10 text-gray-300 rounded-xl hover:bg-white/10 transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <span>🌐</span>
              <span>Otwórz stronę główną</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 active:scale-[0.98] transition-all text-xs font-semibold"
            >
              Wyloguj
            </button>
          </div>
        </header>

        {/* Status Messages */}
        {message.text && (
          <div
            className={`py-3 px-4 rounded-xl mb-6 border text-sm flex items-center justify-between ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}
          >
            <span>{message.text}</span>
            <button
              onClick={() => setMessage({ text: '', type: '' })}
              className="text-xs text-gray-400 hover:text-white ml-4 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Główne Zakładki (Tabs) */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4 mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {/* Tab 1: Wpisy */}
            <button
              onClick={() => {
                setActiveTab('posts');
                setMessage({ text: '', type: '' });
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2.5 ${
                activeTab === 'posts'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.35)]'
                  : 'bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>📝 Wpisy (Blog)</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white">
                {posts.length}
              </span>
            </button>

            {/* Tab 2: Projekty (Szkice Produktów) */}
            <button
              onClick={() => {
                setActiveTab('projects');
                setMessage({ text: '', type: '' });
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2.5 ${
                activeTab === 'projects'
                  ? 'bg-amber-600 border-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.35)]'
                  : 'bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>💡 Projekty (Szkice)</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {projectDrafts.length} w warsztacie
              </span>
            </button>

            {/* Tab 3: Produkty (Aktywne na stronie) */}
            <button
              onClick={() => {
                setActiveTab('products');
                setMessage({ text: '', type: '' });
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2.5 ${
                activeTab === 'products'
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                  : 'bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>📦 Produkty (Katalog)</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {activeProducts.length} widoczne
              </span>
            </button>
          </div>

          {/* Szybka wyszukiwarka */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj po tytule..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:border-indigo-500 outline-none transition-all pl-8"
            />
            <span className="absolute left-2.5 top-2.5 text-xs text-gray-500">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ZAKŁADKA 1: WPISY (BLOG)                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'posts' && (
          <div className="space-y-8">
            {/* KPI Podsumowanie Wpisów */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setPostStatusFilter('all')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  postStatusFilter === 'all'
                    ? 'bg-white/[0.06] border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.08)]'
                    : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04]'
                }`}
              >
                <span className="text-xs uppercase tracking-wider font-semibold text-gray-400 block">Wszystkie wpisy</span>
                <span className="text-2xl font-black text-white mt-1 block">{postStats.total}</span>
              </div>

              <div
                onClick={() => setPostStatusFilter('published')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  postStatusFilter === 'published'
                    ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                    : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Opublikowane</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <span className="text-2xl font-black text-emerald-300 mt-1 block">{postStats.published}</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Widoczne i w pełni czytelne</span>
              </div>

              <div
                onClick={() => setPostStatusFilter('scheduled')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  postStatusFilter === 'scheduled'
                    ? 'bg-purple-950/30 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-purple-400">Zapowiedzi</span>
                  <span className="text-xs">📅</span>
                </div>
                <span className="text-2xl font-black text-purple-300 mt-1 block">{postStats.scheduled}</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Na stronie z datą w przyszłości</span>
              </div>

              <div
                onClick={() => setPostStatusFilter('draft')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  postStatusFilter === 'draft'
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">Szkice</span>
                  <span className="text-xs">🔒</span>
                </div>
                <span className="text-2xl font-black text-amber-300 mt-1 block">{postStats.drafts}</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">Niewidoczne dla czytelników</span>
              </div>
            </div>

            {/* Pasek akcji dodawania */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] border border-white/[0.08] p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filtruj listę:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPostStatusFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      postStatusFilter === 'all'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    Wszystkie ({postStats.total})
                  </button>
                  <button
                    onClick={() => setPostStatusFilter('published')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      postStatusFilter === 'published'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    🟢 Opublikowane ({postStats.published})
                  </button>
                  <button
                    onClick={() => setPostStatusFilter('scheduled')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      postStatusFilter === 'scheduled'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    🟣 Zapowiedzi ({postStats.scheduled})
                  </button>
                  <button
                    onClick={() => setPostStatusFilter('draft')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      postStatusFilter === 'draft'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    🟡 Szkice ({postStats.drafts})
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all flex items-center gap-1.5"
              >
                <span>{showNewPostForm ? '✕ Zamknij formularz' : '+ Dodaj nowy artykuł'}</span>
              </button>
            </div>

            {/* Rozwijany Formularz Dodawania Nowego Artykułu */}
            {showNewPostForm && (
              <form onSubmit={handleCreatePost} className="bg-white/[0.03] border border-indigo-500/30 p-6 rounded-2xl space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>✍️ Nowy artykuł</span>
                  </h3>
                  <span className="text-xs text-gray-400">Wybierz kategorię publikacji poniżej</span>
                </div>

                {/* Wybór kategorii statusu */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      postFormStatus === 'draft'
                        ? 'bg-amber-500/10 border-amber-500 text-white'
                        : 'bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="postStatus"
                      value="draft"
                      checked={postFormStatus === 'draft'}
                      onChange={() => setPostFormStatus('draft')}
                      className="mt-1"
                    />
                    <div>
                      <strong className="block text-xs uppercase tracking-wider text-amber-400">🟡 Szkic</strong>
                      <p className="text-[11px] text-gray-400 mt-1">Niewidoczny dla czytelników. Dostępny tylko w panelu.</p>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      postFormStatus === 'scheduled'
                        ? 'bg-purple-500/10 border-purple-500 text-white'
                        : 'bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="postStatus"
                      value="scheduled"
                      checked={postFormStatus === 'scheduled'}
                      onChange={() => setPostFormStatus('scheduled')}
                      className="mt-1"
                    />
                    <div>
                      <strong className="block text-xs uppercase tracking-wider text-purple-400">🟣 Zapowiedź</strong>
                      <p className="text-[11px] text-gray-400 mt-1">Widoczna karta z odliczaniem do daty w przyszłości.</p>
                    </div>
                  </label>

                  <label
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      postFormStatus === 'published'
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="postStatus"
                      value="published"
                      checked={postFormStatus === 'published'}
                      onChange={() => setPostFormStatus('published')}
                      className="mt-1"
                    />
                    <div>
                      <strong className="block text-xs uppercase tracking-wider text-emerald-400">🟢 Opublikowany</strong>
                      <p className="text-[11px] text-gray-400 mt-1">Natychmiast widoczny i w pełni czytelny na blogu.</p>
                    </div>
                  </label>
                </div>

                {postFormStatus === 'scheduled' && (
                  <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
                    <label className="text-xs uppercase tracking-wider font-semibold text-purple-300 block mb-2">
                      Planowana data publikacji zapowiedzi:
                    </label>
                    <input
                      type="datetime-local"
                      value={postScheduledDate}
                      onChange={(e) => setPostScheduledDate(e.target.value)}
                      required={postFormStatus === 'scheduled'}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Tytuł wpisu</label>
                    <input
                      type="text"
                      value={postTitle}
                      onChange={handleTitleChange}
                      required
                      placeholder="Wprowadź tytuł artykułu"
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
                      placeholder="np. moj-nowy-artykul"
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
                      className="w-full bg-[#111827] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                    >
                      <option value="Psychologia">Psychologia</option>
                      <option value="Technologia">Technologia</option>
                      <option value="Biznes">Biznes</option>
                      <option value="Automatyka & AI">Automatyka & AI</option>
                      <option value="Rozwój">Rozwój (Long-Life Learning)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Tagi (po przecinku)</label>
                    <input
                      type="text"
                      value={postTags}
                      onChange={(e) => setPostTags(e.target.value)}
                      placeholder="plc, automatyka, kariera"
                      className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase text-gray-400 font-semibold block mb-2">Treść artykułu (Markdown)</label>
                  <textarea
                    rows={8}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                    placeholder="Wpisz treść artykułu w formacie Markdown..."
                    className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 text-sm focus:border-indigo-500 outline-none text-white transition-all font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Zapisywanie...' : 'Zapisz artykuł'}
                  </button>
                </div>
              </form>
            )}

            {/* Lista Wpisów */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="bg-white/[0.02] border border-white/[0.08] p-12 text-center rounded-2xl">
                  <span className="text-3xl block mb-2">🔍</span>
                  <p className="text-sm text-gray-400">Brak artykułów spełniających wybrane kryteria wyszukiwania.</p>
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isPub = post.postStatus === 'published';
                  const isSched = post.postStatus === 'scheduled';
                  const isDraft = post.postStatus === 'draft';

                  return (
                    <article
                      key={post.id || post.slug}
                      className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isDraft
                          ? 'bg-amber-950/10 border-amber-500/20 hover:border-amber-500/40'
                          : isSched
                          ? 'bg-purple-950/10 border-purple-500/20 hover:border-purple-500/40'
                          : 'bg-white/[0.02] border-white/[0.08] hover:border-emerald-500/30'
                      }`}
                    >
                      <div className="space-y-1.5 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                              isDraft
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : isSched
                                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                                : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                            }`}
                          >
                            {isDraft ? '🟡 Szkic (niewidoczny)' : isSched ? '🟣 Zapowiedź (data w przyszłości)' : '🟢 Opublikowany'}
                          </span>

                          <span className="text-[10px] font-semibold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                            {post.category}
                          </span>

                          <span className="text-[11px] text-gray-500 font-mono">
                            📅 {new Date(post.createdAt).toLocaleDateString('pl-PL', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-xs text-gray-400 font-mono truncate">
                          /blog/{post.slug}
                        </p>
                      </div>

                      {/* Pasek akcji i szybkiej zmiany statusu */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                        {/* Przycisk podglądu treści w oknie */}
                        <button
                          onClick={() => setPreviewModal({ type: 'post', data: post })}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-all flex items-center gap-1"
                          title="Szybki podgląd treści bez opuszczania panelu"
                        >
                          <span>📄</span>
                          <span>Treść</span>
                        </button>

                        {/* Bezpośredni link podglądu */}
                        <a
                          href={`/blog/${post.slug}?preview=true`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-all flex items-center gap-1"
                        >
                          <span>👁</span>
                          <span>Otwórz</span>
                        </a>

                        {/* Szybkie przełączniki statusu */}
                        {isDraft && (
                          <>
                            <button
                              onClick={() => handlePostStatusChange(post.slug, 'scheduled')}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-all"
                              title="Włącz zapowiedź na stronie z przyszłą datą"
                            >
                              🟣 Włącz Zapowiedź
                            </button>
                            <button
                              onClick={() => handlePostStatusChange(post.slug, 'published')}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all"
                              title="Opublikuj natychmiast dla czytelników"
                            >
                              🟢 Publikuj teraz
                            </button>
                          </>
                        )}

                        {isSched && (
                          <>
                            <button
                              onClick={() => handlePostStatusChange(post.slug, 'published')}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all"
                            >
                              🟢 Publikuj teraz
                            </button>
                            <button
                              onClick={() => handlePostStatusChange(post.slug, 'draft')}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-all"
                              title="Ukryj całkowicie przed czytelnikami"
                            >
                              🟡 Cofnij do Szkicu
                            </button>
                          </>
                        )}

                        {isPub && (
                          <button
                            onClick={() => handlePostStatusChange(post.slug, 'draft')}
                            disabled={loading}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-all"
                            title="Wycofaj artykuł do szkiców"
                          >
                            🟡 Cofnij do Szkicu
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZAKŁADKA 2: PROJEKTY (SZKICE PRODUKTÓW / R&D)                             */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-amber-500/20 p-6 rounded-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <span>💡 Projekty Warsztatowe (Inkubator Szkiców Produktów)</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
                    To Twój warsztat roboczy. Poniższe kursy i narzędzia mają status <span className="text-amber-400 font-semibold">Szkic</span> i są <strong className="text-white">niewidoczne dla czytelników na blogu</strong>. Gdy uznasz, że pomysł jest gotowy do wystartowania z kampanią — kliknij przycisk <span className="text-purple-400 font-semibold">„Uruchom Zapowiedź”</span>. Wtedy produkt automatycznie przeniesie się do zakładki <strong className="text-emerald-300">Produkty</strong> i pojawi się na blogu ze zbieraniem zapisów na listę startową!
                  </p>
                </div>
                <span className="text-xs px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                  Szkice projektów: <strong>{projectDrafts.length}</strong>
                </span>
              </div>

              {projectDrafts.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <span className="text-4xl block mb-2">🎉</span>
                  <p className="text-sm font-semibold text-white">Wszystkie projekty zostały zapowiedziane lub opublikowane!</p>
                  <p className="text-xs text-gray-500 mt-1">Znajdziesz je w zakładce „Produkty”.</p>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projectDrafts.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-6 rounded-2xl border bg-amber-950/10 border-amber-500/20 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border bg-amber-500/20 border-amber-500/40 text-amber-300">
                              🔒 Projekt roboczy (Szkic)
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-gray-400 bg-white/5 px-2 py-1 rounded">
                              {prod.category}
                            </span>
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
                            <p className="text-[11px] font-semibold text-amber-300/80 uppercase tracking-wider mb-2">
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
                          <button
                            onClick={() => setPreviewModal({ type: 'product', data: prod })}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-all flex items-center gap-1"
                          >
                            <span>🔍</span>
                            <span>Podgląd</span>
                          </button>
                          <a
                            href={`/produkty/${prod.slug}?preview=admin`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-all flex items-center gap-1"
                          >
                            <span>👁</span>
                            <span>Otwórz</span>
                          </a>
                        </div>

                        {/* Przeniesienie do Produktów jako Zapowiedź */}
                        <button
                          onClick={() => handleProductStatusChange(prod.slug, 'Zapowiedź')}
                          disabled={loading}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center gap-1.5"
                        >
                          <span>🚀</span>
                          <span>Uruchom Zapowiedź &rarr; Produkty</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ZAKŁADKA 3: PRODUKTY (KATALOG WIDOCZNY & ZAPOWIEDZI)                      */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-emerald-500/20 p-6 rounded-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                    <span>📦 Aktywny Katalog Produktów & Zapowiedzi</span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
                    Produkty w tej zakładce są <strong className="text-emerald-300">widoczne dla czytelników na stronie /produkty</strong>. Jeśli chcesz wycofać produkt z widoku publicznego, kliknij przycisk <span className="text-amber-400 font-semibold">„Cofnij do Projektów”</span> — produkt natychmiast wróci jako szkic do zakładki Projekty.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
                    Widocznych w katalogu: <strong>{activeProducts.length}</strong>
                  </span>
                  <a
                    href="/produkty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300 hover:text-white transition-all flex items-center gap-1"
                  >
                    <span>🌐</span>
                    <span>Zobacz katalog publiczny</span>
                  </a>
                </div>
              </div>

              {activeProducts.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <span className="text-4xl block mb-2">📦</span>
                  <p className="text-sm font-semibold text-white">Brak aktywnych produktów w katalogu.</p>
                  <p className="text-xs text-gray-500 mt-1">Przejdź do zakładki „Projekty (Szkice)” i uruchom zapowiedź wybranego kursu.</p>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeProducts.map((prod) => {
                    const isZapowiedz = prod.status === 'Zapowiedź' || prod.status === 'W przygotowaniu';

                    return (
                      <div
                        key={prod.id}
                        className="p-6 rounded-2xl border bg-white/[0.02] border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                                  isZapowiedz
                                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                                    : prod.status === 'W realizacji'
                                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                                }`}
                              >
                                {isZapowiedz ? '🟣 Zapowiedź (zbieranie zapisów)' : `🟢 ${prod.status}`}
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
                              <p className="text-[11px] font-semibold text-emerald-300/80 uppercase tracking-wider mb-2">
                                Moduły ({prod.modules.length}):
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
                          {/* Zmiana etapu w ramach produktów */}
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] text-gray-400 font-semibold">Status:</label>
                            <select
                              value={prod.status}
                              onChange={(e) => handleProductStatusChange(prod.slug, e.target.value)}
                              disabled={loading}
                              className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white focus:border-indigo-500 outline-none"
                            >
                              <option value="Zapowiedź" className="bg-[#111827] text-purple-300">🟣 Zapowiedź</option>
                              <option value="W przygotowaniu" className="bg-[#111827] text-sky-300">🚀 W przygotowaniu</option>
                              <option value="W realizacji" className="bg-[#111827] text-indigo-300">⏳ W realizacji</option>
                              <option value="Dostępny" className="bg-[#111827] text-emerald-300">✅ Dostępny</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`/produkty/${prod.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-all flex items-center gap-1"
                            >
                              <span>👁</span>
                              <span>Zobacz</span>
                            </a>

                            {/* Przycisk wycofania do Projektów */}
                            <button
                              onClick={() => handleProductStatusChange(prod.slug, 'Szkic')}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-all"
                              title="Wycofaj produkt ze strony i przenieś do zakładki Projekty jako szkic"
                            >
                              🔒 Cofnij do Projektów
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL SZYBKIEGO PODGLĄDU (IN-PANEL PREVIEW)                               */}
        {/* ========================================================================= */}
        {previewModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111827] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {previewModal.type === 'post' ? '📄' : '📦'}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {previewModal.data.title}
                    </h3>
                    <span className="text-xs text-gray-400 font-mono">
                      {previewModal.type === 'post'
                        ? `/blog/${(previewModal.data as AdminPost).slug}`
                        : `/produkty/${(previewModal.data as AdminProduct).slug}`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewModal(null)}
                  className="h-8 w-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-300">
                {previewModal.type === 'post' ? (
                  <div>
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5 text-xs text-gray-400">
                      <span>Kategoria: <strong className="text-white">{(previewModal.data as AdminPost).category}</strong></span>
                      <span>Status: <strong className="text-emerald-400">{(previewModal.data as AdminPost).statusLabel}</strong></span>
                    </div>
                    <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5 max-h-[50vh] overflow-y-auto">
                      {(previewModal.data as AdminPost).content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm italic text-gray-300 mb-2">
                        „{(previewModal.data as AdminProduct).headline}”
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {(previewModal.data as AdminProduct).description}
                      </p>
                    </div>

                    {(previewModal.data as AdminProduct).modules && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                          Szczegółowy program kursu:
                        </h4>
                        <div className="space-y-3">
                          {(previewModal.data as AdminProduct).modules?.map((m) => (
                            <div key={m.number} className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                              <p className="text-xs font-bold text-indigo-300">
                                Moduł {m.number}: {m.title}
                              </p>
                              {m.description && <p className="text-[11px] text-gray-400 mt-0.5">{m.description}</p>}
                              <ul className="mt-2 space-y-1 pl-3 border-l border-white/10">
                                {m.lessons.map((l, i) => (
                                  <li key={i} className="text-[11px] text-gray-400">• {l}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                <button
                  onClick={() => setPreviewModal(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-semibold"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
