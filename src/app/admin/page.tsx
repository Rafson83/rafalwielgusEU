'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownView from '@/components/MarkdownView';

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

export interface AdminComment {
  id: number;
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  moderationReason?: string;
  isAuthorReply?: boolean;
  parentId?: number | null;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'projects' | 'products' | 'comments'>('posts');
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [commentStatusFilter, setCommentStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'spam'>('all');
  const [replyModalComment, setReplyModalComment] = useState<AdminComment | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Filtry i wyszukiwarka
  const [searchQuery, setSearchQuery] = useState('');
  const [postStatusFilter, setPostStatusFilter] = useState<'all' | 'published' | 'scheduled' | 'draft'>('all');

  // =========================================================================
  // STAN EDYTORA ARTYKUŁÓW (TWORZENIE & EDYCJA)
  // =========================================================================
  const [postEditorOpen, setPostEditorOpen] = useState(false);
  const [isEditingExistingPost, setIsEditingExistingPost] = useState(false);
  const [editingPostOriginalSlug, setEditingPostOriginalSlug] = useState('');

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

  // Widok edytora: edytor / split / podgląd
  const [editorViewMode, setEditorViewMode] = useState<'editor' | 'split' | 'preview'>('split');
  const [showPromptsPanel, setShowPromptsPanel] = useState(true);
  const [showSeoSettings, setShowSeoSettings] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // =========================================================================
  // STAN EDYTORA PRODUKTU / PROJEKTU
  // =========================================================================
  const [productEditorOpen, setProductEditorOpen] = useState(false);
  const [editingProductSlug, setEditingProductSlug] = useState('');
  const [prodForm, setProdForm] = useState({
    title: '',
    headline: '',
    tagline: '',
    description: '',
    price: '',
    priceNote: '',
    category: 'Kurs & Warsztat',
    badge: '',
    status: 'Szkic',
  });

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
      const commentsRes = await fetch('/api/comments?admin=true');
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      }
    } catch (err) {
      console.error('Błąd pobierania danych dashboardu:', err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  // Helper generowania sluga
  const generateSlugFromTitle = (titleText: string) => {
    return titleText
      .toLowerCase()
      .trim()
      .replace(/ą/g, 'a')
      .replace(/ć/g, 'c')
      .replace(/ę/g, 'e')
      .replace(/ł/g, 'l')
      .replace(/ń/g, 'n')
      .replace(/ó/g, 'o')
      .replace(/ś/g, 's')
      .replace(/ź/g, 'z')
      .replace(/ż/g, 'z')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPostTitle(val);
    if (!isEditingExistingPost) {
      setPostSlug(generateSlugFromTitle(val));
    }
  };

  // Otwieranie formularza NOWEGO artykułu
  const handleOpenNewPostEditor = () => {
    setIsEditingExistingPost(false);
    setEditingPostOriginalSlug('');
    setPostTitle('');
    setPostSlug('');
    setPostCategory('Psychologia');
    setPostContent('');
    setPostTags('');
    setPostSeoTitle('');
    setPostSeoDescription('');
    setPostThumbnailUrl('');
    setPostFormStatus('draft');
    setPostScheduledDate('');
    setShowSeoSettings(false);
    setEditorViewMode('split');
    setPostEditorOpen(true);
  };

  // Otwieranie EDYCJI ISTNIEJĄCEGO artykułu
  const handleOpenEditPost = (post: AdminPost) => {
    setIsEditingExistingPost(true);
    setEditingPostOriginalSlug(post.slug);
    setPostTitle(post.title);
    setPostSlug(post.slug);
    setPostCategory(post.category || 'Psychologia');
    setPostContent(post.content || '');
    setPostTags(post.tags || '');
    setPostSeoTitle(post.seoTitle || '');
    setPostSeoDescription(post.seoDescription || '');
    setPostThumbnailUrl(post.thumbnailUrl || '');
    setPostFormStatus(post.postStatus);

    if (post.postStatus === 'scheduled' && post.createdAt) {
      const d = new Date(post.createdAt);
      const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setPostScheduledDate(isoLocal);
    } else {
      setPostScheduledDate('');
    }

    setShowSeoSettings(!!(post.seoTitle || post.seoDescription || post.tags));
    setEditorViewMode('split');
    setPostEditorOpen(true);
  };

  // Wstawianie znaczników Markdown do textarea
  const insertMarkdown = (before: string, after = '', defaultText = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setPostContent((prev) => prev + before + defaultText + after);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = postContent.substring(start, end) || defaultText;
    const replacement = before + selected + after;

    const newContent = postContent.substring(0, start) + replacement + postContent.substring(end);
    setPostContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 40);
  };

  // Zapis posta (Nowy lub Edycja)
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (isEditingExistingPost) {
        // PUT /api/posts - pełna edycja
        const res = await fetch('/api/posts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            originalSlug: editingPostOriginalSlug,
            slug: postSlug,
            title: postTitle,
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
        if (!res.ok) throw new Error(data.error || 'Nie udało się zaktualizować artykułu');

        setMessage({ text: `Zapisano zmiany w artykule "${postTitle}"!`, type: 'success' });
      } else {
        // POST /api/posts - nowy artykuł
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

        setMessage({ text: `Artykuł "${postTitle}" został pomyślnie utworzony!`, type: 'success' });
      }

      setPostEditorOpen(false);
      await fetchData();
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : 'Błąd zapisu artykułu',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Szybka zmiana statusu artykułu z listy
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

  // Otwarcie edytora produktu
  const handleOpenEditProduct = (prod: AdminProduct) => {
    setEditingProductSlug(prod.slug);
    setProdForm({
      title: prod.title || '',
      headline: prod.headline || '',
      tagline: prod.tagline || '',
      description: prod.description || '',
      price: prod.price || '',
      priceNote: prod.priceNote || '',
      category: prod.category || 'Kurs & Warsztat',
      badge: prod.badge || '',
      status: prod.status || 'Szkic',
    });
    setProductEditorOpen(true);
  };

  // Zapis edycji produktu
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: editingProductSlug,
          ...prodForm,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Nie udało się zapisać zmian w produkcie');

      setMessage({ text: `Pomyślnie zaktualizowano produkt "${prodForm.title}"!`, type: 'success' });
      setProductEditorOpen(false);
      await fetchData();
    } catch (err: unknown) {
      setMessage({
        text: err instanceof Error ? err.message : 'Błąd zapisu produktu',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Zmiana statusu produktu z listy
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

  // Statystyki tekstu w edytorze
  const editorStats = useMemo(() => {
    const trimmed = postContent.trim();
    if (!trimmed) return { words: 0, chars: 0, readTimeMinutes: 1, paragraphs: 0 };
    const words = trimmed.split(/\s+/).length;
    const chars = trimmed.length;
    const paragraphs = trimmed.split(/\n\s*\n/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readTimeMinutes, paragraphs };
  }, [postContent]);

  // Podział produktów
  const projectDrafts = useMemo(() => {
    return products.filter((p) => p.status === 'Szkic' || p.isDraft);
  }, [products]);

  const activeProducts = useMemo(() => {
    return products.filter((p) => p.status !== 'Szkic' && !p.isDraft);
  }, [products]);

  // Filtrowanie wpisów
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (postStatusFilter === 'published' && post.postStatus !== 'published') return false;
      if (postStatusFilter === 'scheduled' && post.postStatus !== 'scheduled') return false;
      if (postStatusFilter === 'draft' && post.postStatus !== 'draft') return false;

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

  // Akcje moderacji komentarzy
  const handleUpdateCommentStatus = async (
    id: number,
    status: 'pending' | 'approved' | 'rejected' | 'spam'
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setMessage({ text: `Zaktualizowano status komentarza (#${id}) na: ${status}`, type: 'success' });
        fetchData();
      } else {
        setMessage({ text: 'Błąd aktualizacji statusu komentarza', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Błąd połączenia z serwerem', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm('Czy na pewno chcesz trwale usunąć ten komentarz?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ text: 'Komentarz został trwale usunięty', type: 'success' });
        fetchData();
      } else {
        setMessage({ text: 'Błąd usuwania komentarza', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Błąd połączenia z serwerem', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendAuthorReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModalComment || !replyContent.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${replyModalComment.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug: replyModalComment.postSlug,
          content: replyContent.trim(),
        }),
      });
      if (res.ok) {
        setMessage({ text: 'Odpowiedź autora została opublikowana!', type: 'success' });
        setReplyModalComment(null);
        setReplyContent('');
        fetchData();
      } else {
        setMessage({ text: 'Błąd publikacji odpowiedzi', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Błąd połączenia z serwerem', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Statystyki i filtry komentarzy
  const commentStats = useMemo(() => {
    const pending = comments.filter((c) => c.status === 'pending').length;
    const approved = comments.filter((c) => c.status === 'approved').length;
    const rejected = comments.filter((c) => c.status === 'rejected' || c.status === 'spam').length;
    return { total: comments.length, pending, approved, rejected };
  }, [comments]);

  const filteredComments = useMemo(() => {
    return comments.filter((c) => {
      if (commentStatusFilter !== 'all') {
        if (commentStatusFilter === 'rejected') {
          if (c.status !== 'rejected' && c.status !== 'spam') return false;
        } else if (c.status !== commentStatusFilter) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAuthor = c.authorName.toLowerCase().includes(q);
        const matchContent = c.content.toLowerCase().includes(q);
        const matchSlug = c.postSlug.toLowerCase().includes(q);
        return matchAuthor || matchContent || matchSlug;
      }
      return true;
    });
  }, [comments, commentStatusFilter, searchQuery]);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#0b0f19] text-white p-4 sm:p-8 font-sans flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
          <span className="text-xs font-mono text-gray-400">Ładowanie kokpitu administratora...</span>
        </div>
      </main>
    );
  }

  return (
    <main suppressHydrationWarning className="min-h-screen bg-[#0b0f19] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center pb-6 border-b border-white/[0.08] mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Kokpit Twórcy & Administratora
              </h1>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                RW. Workshop v2.5 — Markdown Studio
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              Pełny edytor Markdown, harmonogram publikacji, inkubator projektów i katalog produktów cyfrowych
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

            <button
              onClick={() => {
                setActiveTab('comments');
                setMessage({ text: '', type: '' });
              }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2.5 ${
                activeTab === 'comments'
                  ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                  : 'bg-white/[0.02] border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>💬 Dyskusja (Komentarze)</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                commentStats.pending > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-white/10 text-white border-white/10'
              }`}>
                {comments.length} {commentStats.pending > 0 ? `(${commentStats.pending} do decyzji)` : ''}
              </span>
            </button>
          </div>

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
                onClick={handleOpenNewPostEditor}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all flex items-center gap-1.5"
              >
                <span>+ Napisz nowy artykuł</span>
              </button>
            </div>

            {/* Lista Wpisów z przyciskiem EDYTUJ */}
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
                            {isDraft ? '🟡 Szkic (niewidoczny)' : isSched ? '🟣 Zapowiedź' : '🟢 Opublikowany'}
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

                      {/* Pasek akcji i przycisk EDYTUJ */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                        {/* Główny przycisk EDYCJI TREŚCI */}
                        <button
                          onClick={() => handleOpenEditPost(post)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 transition-all flex items-center gap-1.5 shadow-sm"
                          title="Edytuj treść, tytuł, status i formatowanie artykułu"
                        >
                          <span>✏️</span>
                          <span>Edytuj treść</span>
                        </button>

                        {/* Przycisk podglądu treści w oknie */}
                        <button
                          onClick={() => setPreviewModal({ type: 'post', data: post })}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-all flex items-center gap-1"
                          title="Szybki podgląd treści bez opuszczania panelu"
                        >
                          <span>📄</span>
                          <span>Podgląd</span>
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
                              🟣 Zapowiedź
                            </button>
                            <button
                              onClick={() => handlePostStatusChange(post.slug, 'published')}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-all"
                              title="Opublikuj natychmiast dla czytelników"
                            >
                              🟢 Publikuj
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
                              🟢 Publikuj
                            </button>
                            <button
                              onClick={() => handlePostStatusChange(post.slug, 'draft')}
                              disabled={loading}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 transition-all"
                              title="Ukryj całkowicie przed czytelnikami"
                            >
                              🟡 Szkic
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
                    To Twój warsztat roboczy. Poniższe kursy i narzędzia mają status <span className="text-amber-400 font-semibold">Szkic</span> i są <strong className="text-white">niewidoczne dla czytelników na blogu</strong>. Możesz w każdej chwili edytować ich opisy, hasła i ceny. Gdy uznasz, że pomysł jest gotowy — kliknij <span className="text-purple-400 font-semibold">„Uruchom Zapowiedź”</span>, a produkt automatycznie przeniesie się do zakładki <strong className="text-emerald-300">Produkty</strong>.
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
                            onClick={() => handleOpenEditProduct(prod)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 transition-all flex items-center gap-1"
                            title="Edytuj treść, hasło i cenę projektu"
                          >
                            <span>✏️</span>
                            <span>Edytuj</span>
                          </button>
                          <button
                            onClick={() => setPreviewModal({ type: 'product', data: prod })}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-all flex items-center gap-1"
                          >
                            <span>🔍</span>
                            <span>Podgląd</span>
                          </button>
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
                    Produkty w tej zakładce są <strong className="text-emerald-300">widoczne dla czytelników na stronie /produkty</strong>. Możesz edytować ich opisy, hasła, statusy i ceny bezpośrednio stąd.
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
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 transition-all flex items-center gap-1"
                              title="Edytuj treść, hasło i cenę produktu"
                            >
                              <span>✏️</span>
                              <span>Edytuj</span>
                            </button>

                            <a
                              href={`/produkty/${prod.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-all flex items-center gap-1"
                            >
                              <span>👁</span>
                              <span>Zobacz</span>
                            </a>

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
        {/* ZAKŁADKA 4: MODERACJA DYSKUSJI I KOMENTARZY (AUTOMATYCZNA + AUTORSKA)     */}
        {/* ========================================================================= */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            {/* Statystyki Komentarzy */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/[0.02] border border-white/[0.08] p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-gray-400 text-xs font-semibold">
                  <span>Wszystkie wpisy</span>
                  <span>💬</span>
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-white">
                  {commentStats.total}
                </div>
              </div>

              <div className="bg-amber-500/[0.04] border border-amber-500/20 p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-amber-300 text-xs font-semibold">
                  <span>Do weryfikacji</span>
                  <span>⏳</span>
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                  {commentStats.pending}
                </div>
              </div>

              <div className="bg-emerald-500/[0.04] border border-emerald-500/20 p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-300 text-xs font-semibold">
                  <span>Zaakceptowane</span>
                  <span>✅</span>
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                  {commentStats.approved}
                </div>
              </div>

              <div className="bg-rose-500/[0.04] border border-rose-500/20 p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-rose-300 text-xs font-semibold">
                  <span>Spam / Odrzucone</span>
                  <span>🚫</span>
                </div>
                <div className="mt-3 text-2xl sm:text-3xl font-bold font-mono text-rose-400">
                  {commentStats.rejected}
                </div>
              </div>
            </div>

            {/* Filtr Statusu Komentarzy */}
            <div className="bg-[#111827]/40 border border-white/[0.08] p-6 rounded-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <span>💬 Dyskusja Warsztatowa & Moderacja</span>
                    <span className="text-xs font-normal text-gray-400 font-mono">
                      ({filteredComments.length} {filteredComments.length === 1 ? 'komentarz' : 'komentarzy'})
                    </span>
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Automatyczny filtr heurystyczny ocenia treść, linki i wulgaryzmy. Decyduj o zatwierdzeniu lub odpowiedz bezpośrednio jako Autor.
                  </p>
                </div>

                {/* Przyciski filtrów */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setCommentStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      commentStatusFilter === 'all'
                        ? 'bg-white/20 border-white text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Wszystkie ({commentStats.total})
                  </button>
                  <button
                    onClick={() => setCommentStatusFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      commentStatusFilter === 'pending'
                        ? 'bg-amber-600/30 border-amber-500 text-amber-200'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    ⏳ Do weryfikacji ({commentStats.pending})
                  </button>
                  <button
                    onClick={() => setCommentStatusFilter('approved')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      commentStatusFilter === 'approved'
                        ? 'bg-emerald-600/30 border-emerald-500 text-emerald-200'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    ✅ Zaakceptowane ({commentStats.approved})
                  </button>
                  <button
                    onClick={() => setCommentStatusFilter('rejected')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      commentStatusFilter === 'rejected'
                        ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    🚫 Spam / Odrzucone ({commentStats.rejected})
                  </button>
                </div>
              </div>

              {/* Lista Komentarzy */}
              {filteredComments.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <span className="text-4xl block mb-2">💬</span>
                  <p className="text-sm font-semibold text-white">Brak komentarzy w tej kategorii.</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Gdy czytelnicy dodadzą komentarz pod artykułem, pojawi się on tutaj z automatyczną oceną jakościową.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComments.map((comm) => {
                    const isPending = comm.status === 'pending';
                    const isApproved = comm.status === 'approved';
                    const isSpamOrRejected = comm.status === 'spam' || comm.status === 'rejected';

                    return (
                      <div
                        key={comm.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          isPending
                            ? 'bg-amber-500/[0.03] border-amber-500/30'
                            : isApproved
                            ? 'bg-white/[0.02] border-white/[0.08]'
                            : 'bg-rose-500/[0.03] border-rose-500/20 opacity-75'
                        }`}
                      >
                        {/* Header komentarza */}
                        <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              comm.isAuthorReply
                                ? 'bg-indigo-600 text-white border border-indigo-400'
                                : 'bg-white/10 text-gray-200 border border-white/10'
                            }`}>
                              {comm.isAuthorReply ? 'RW' : comm.authorName.slice(0, 2).toUpperCase()}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-white">
                                  {comm.authorName}
                                </span>
                                {comm.isAuthorReply && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                    Autor
                                  </span>
                                )}
                                {comm.authorEmail && (
                                  <span className="text-xs text-gray-500 font-mono">
                                    &lt;{comm.authorEmail}&gt;
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                <span>{new Date(comm.createdAt).toLocaleString('pl-PL')}</span>
                                <span>&bull;</span>
                                <span>Wpis ID: #{comm.id}</span>
                                {comm.parentId && (
                                  <>
                                    <span>&bull;</span>
                                    <span className="text-purple-300">↩ Odpowiedź na #{comm.parentId}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Odnośnik do wpisu */}
                            <a
                              href={`/blog/${comm.postSlug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-300 transition-all flex items-center gap-1"
                            >
                              <span>📄 /{comm.postSlug}</span>
                              <span>↗</span>
                            </a>

                            {/* Badge statusu */}
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              isApproved
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : isPending
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            }`}>
                              {isApproved ? '✅ Zaakceptowany' : isPending ? '⏳ Oczekuje' : comm.status === 'spam' ? '🛑 Spam' : '🚫 Odrzucony'}
                            </span>
                          </div>
                        </div>

                        {/* Baner diagnozy automatycznej moderacji */}
                        {comm.moderationReason && (
                          <div className="mt-3 px-3 py-1.5 rounded-lg bg-black/30 border border-white/5 text-[11px] text-gray-400 flex items-center gap-2">
                            <span className="text-indigo-400">🤖 Automatyczna moderacja:</span>
                            <span>{comm.moderationReason}</span>
                          </div>
                        )}

                        {/* Treść wypowiedzi */}
                        <div className="mt-3.5 p-4 rounded-xl bg-black/40 border border-white/[0.05] text-sm text-gray-200 font-serif leading-relaxed whitespace-pre-line">
                          {comm.content}
                        </div>

                        {/* Akcje pod komentarzem */}
                        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {!isApproved && (
                              <button
                                onClick={() => handleUpdateCommentStatus(comm.id, 'approved')}
                                disabled={loading}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 transition-all flex items-center gap-1"
                              >
                                <span>✅</span>
                                <span>Zatwierdź wpis</span>
                              </button>
                            )}

                            {!isPending && (
                              <button
                                onClick={() => handleUpdateCommentStatus(comm.id, 'pending')}
                                disabled={loading}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-300 transition-all flex items-center gap-1"
                              >
                                <span>⏳</span>
                                <span>Cofnij do weryfikacji</span>
                              </button>
                            )}

                            {!isSpamOrRejected && (
                              <button
                                onClick={() => handleUpdateCommentStatus(comm.id, 'spam')}
                                disabled={loading}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-300 transition-all flex items-center gap-1"
                              >
                                <span>🚫</span>
                                <span>Oznacz jako spam</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setReplyModalComment(comm);
                                setReplyContent('');
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 transition-all flex items-center gap-1"
                            >
                              <span>💬</span>
                              <span>Odpowiedz jako Rafał Wielgus</span>
                            </button>
                          </div>

                          <button
                            onClick={() => handleDeleteComment(comm.id)}
                            disabled={loading}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
                            title="Usuń trwale ten wpis"
                          >
                            🗑️ Usuń wpis
                          </button>
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
        {/* MODAL ODPOWIEDZI AUTORA (RAFAŁ WIELGUS)                                   */}
        {/* ========================================================================= */}
        {replyModalComment && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#0f172a] border border-white/15 rounded-2xl w-full max-w-xl shadow-2xl p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>💬 Odpowiedz jako Autor</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Rafał Wielgus
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Wątek: #{replyModalComment.id} autorstwa {replyModalComment.authorName}
                  </p>
                </div>
                <button
                  onClick={() => setReplyModalComment(null)}
                  className="text-gray-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Oryginalny komentarz */}
              <div className="mt-4 p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-300 italic max-h-24 overflow-y-auto">
                „{replyModalComment.content}”
              </div>

              <form onSubmit={handleSendAuthorReply} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Treść Twojej odpowiedzi warsztatowej:
                  </label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Wpisz odpowiedź merytoryczną, komentarz z hali lub podziękowanie..."
                    rows={4}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-indigo-500 outline-none"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setReplyModalComment(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-gray-300 hover:text-white"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !replyContent.trim()}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Publikuję...' : 'Opublikuj odpowiedź jako Autor →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL PEŁNEGO EDYTORA ARTYKUŁU (MARKDOWN STUDIO + PODPOWIEDZI)           */}
        {/* ========================================================================= */}
        {postEditorOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-[#0f172a] border border-white/15 rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
              {/* Header Edytora */}
              <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#1e293b]/70 gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✍️</span>
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
                      <span>{isEditingExistingPost ? 'Edycja artykułu' : 'Nowy artykuł'}</span>
                      {isEditingExistingPost && (
                        <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {editingPostOriginalSlug}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Formatuj tekst za pomocą paska narzędzi lub pisz w czystym Markdown z podpowiedziami
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPostEditorOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition-all"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleSavePost}
                    disabled={loading || !postTitle.trim() || !postContent.trim()}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <span>{loading ? 'Zapisywanie...' : '💾 Zapisz artykuł'}</span>
                  </button>
                </div>
              </div>

              {/* Treść Edytora - Przewijana */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
                {/* 1. Status Publikacji (Szkic / Zapowiedź / Publikacja) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      postFormStatus === 'draft'
                        ? 'bg-amber-500/15 border-amber-500/70 text-white'
                        : 'bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="postEditorStatus"
                      value="draft"
                      checked={postFormStatus === 'draft'}
                      onChange={() => setPostFormStatus('draft')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="block text-xs uppercase tracking-wider text-amber-400">🟡 Szkic roboczy</strong>
                      <p className="text-[11px] text-gray-400 mt-0.5">Ukryty przed czytelnikami. Edytuj bez pośpiechu.</p>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      postFormStatus === 'scheduled'
                        ? 'bg-purple-500/15 border-purple-500/70 text-white'
                        : 'bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="postEditorStatus"
                      value="scheduled"
                      checked={postFormStatus === 'scheduled'}
                      onChange={() => setPostFormStatus('scheduled')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="block text-xs uppercase tracking-wider text-purple-400">🟣 Zapowiedź</strong>
                      <p className="text-[11px] text-gray-400 mt-0.5">Karta widoczna na blogu z przyszłą datą premiery.</p>
                    </div>
                  </label>

                  <label
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      postFormStatus === 'published'
                        ? 'bg-emerald-500/15 border-emerald-500/70 text-white'
                        : 'bg-white/[0.02] border-white/10 text-gray-400 hover:bg-white/[0.04]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="postEditorStatus"
                      value="published"
                      checked={postFormStatus === 'published'}
                      onChange={() => setPostFormStatus('published')}
                      className="mt-0.5"
                    />
                    <div>
                      <strong className="block text-xs uppercase tracking-wider text-emerald-400">🟢 Opublikowany</strong>
                      <p className="text-[11px] text-gray-400 mt-0.5">Widoczny i w pełni czytelny dla wszystkich.</p>
                    </div>
                  </label>
                </div>

                {/* Pole daty zapowiedzi */}
                {postFormStatus === 'scheduled' && (
                  <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 flex flex-wrap items-center gap-4">
                    <label className="text-xs uppercase tracking-wider font-semibold text-purple-300">
                      Planowana data i godzina publikacji:
                    </label>
                    <input
                      type="datetime-local"
                      value={postScheduledDate}
                      onChange={(e) => setPostScheduledDate(e.target.value)}
                      required={postFormStatus === 'scheduled'}
                      className="bg-black/40 border border-purple-500/50 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-400 outline-none"
                    />
                  </div>
                )}

                {/* 2. Główne dane: Tytuł, Slug, Kategoria */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-6">
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-1.5">Tytuł artykułu</label>
                    <input
                      type="text"
                      value={postTitle}
                      onChange={handleTitleChange}
                      required
                      placeholder="Wprowadź tytuł wpisu..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white font-medium"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs uppercase text-gray-400 font-semibold">Slug (URL)</label>
                      <button
                        type="button"
                        onClick={() => setPostSlug(generateSlugFromTitle(postTitle))}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 underline"
                      >
                        Generuj z tytułu
                      </button>
                    </div>
                    <input
                      type="text"
                      value={postSlug}
                      onChange={(e) => setPostSlug(e.target.value)}
                      required
                      placeholder="np. moj-nowy-wpis"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white font-mono text-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-1.5">Kategoria</label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 outline-none text-white"
                    >
                      <option value="Psychologia">Psychologia</option>
                      <option value="Technologia">Technologia</option>
                      <option value="Biznes">Biznes</option>
                      <option value="Automatyka & AI">Automatyka & AI</option>
                      <option value="Rozwój">Rozwój (Long-Life Learning)</option>
                    </select>
                  </div>
                </div>

                {/* Rozwijana sekcja SEO / Tagi */}
                <div className="border border-white/10 rounded-xl bg-white/[0.01] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowSeoSettings(!showSeoSettings)}
                    className="w-full px-4 py-2.5 text-xs text-gray-400 hover:text-white flex items-center justify-between font-semibold"
                  >
                    <span>⚙️ Opcje zaawansowane: Tagi, Miniaturka i SEO ({showSeoSettings ? 'Zwiń' : 'Rozwiń'})</span>
                    <span>{showSeoSettings ? '▲' : '▼'}</span>
                  </button>

                  {showSeoSettings && (
                    <div className="p-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20">
                      <div>
                        <label className="text-xs uppercase text-gray-400 font-semibold block mb-1">Tagi (oddzielone przecinkami)</label>
                        <input
                          type="text"
                          value={postTags}
                          onChange={(e) => setPostTags(e.target.value)}
                          placeholder="plc, automatyka, diagnostyka, python"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase text-gray-400 font-semibold block mb-1">URL Miniaturki (okładka)</label>
                        <input
                          type="text"
                          value={postThumbnailUrl}
                          onChange={(e) => setPostThumbnailUrl(e.target.value)}
                          placeholder="/images/posts/artykul-1.jpg"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase text-gray-400 font-semibold block mb-1">Tytuł SEO</label>
                        <input
                          type="text"
                          value={postSeoTitle}
                          onChange={(e) => setPostSeoTitle(e.target.value)}
                          placeholder="Tytuł pod Google / social media"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs uppercase text-gray-400 font-semibold block mb-1">Opis SEO (Meta Description)</label>
                        <input
                          type="text"
                          value={postSeoDescription}
                          onChange={(e) => setPostSeoDescription(e.target.value)}
                          placeholder="Krótki opis 150-160 znaków wyświetlany w wyszukiwarce"
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ========================================================================= */}
                {/* 3. PASEK NARZĘDZI FORMATOWANIA MARKDOWN + PODPOWIEDZI                      */}
                {/* ========================================================================= */}
                <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0d1424]">
                  {/* Główny Toolbar */}
                  <div className="p-3 border-b border-white/10 bg-[#162032] flex flex-wrap items-center justify-between gap-2">
                    {/* Przyciski formatowania */}
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                      <button
                        type="button"
                        onClick={() => insertMarkdown('## ', '', 'Nagłówek sekcji')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10"
                        title="Nagłówek sekcji H2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('### ', '', 'Podtytuł')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10"
                        title="Podtytuł H3"
                      >
                        H3
                      </button>
                      <span className="h-4 w-px bg-white/10 mx-1"></span>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('**', '**', 'pogrubiony tekst')}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10"
                        title="Pogrubienie"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('*', '*', 'kursywa')}
                        className="px-2.5 py-1 rounded-lg text-xs italic font-bold bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10"
                        title="Kursywa"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('`', '`', 'kod')}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/15 text-indigo-300 border border-white/10"
                        title="Kod liniowy"
                      >
                        `kod`
                      </button>
                      <span className="h-4 w-px bg-white/10 mx-1"></span>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('- ', '', 'Punkt listy')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10"
                        title="Lista punktowana"
                      >
                        • Lista
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('1. ', '', 'Krok pierwszy')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10"
                        title="Lista numerowana"
                      >
                        1. Numer
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('> ', '', 'Ważny cytat lub myśl przewodnia')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10"
                        title="Cytat"
                      >
                        „” Cytat
                      </button>
                      <span className="h-4 w-px bg-white/10 mx-1"></span>
                      <button
                        type="button"
                        onClick={() =>
                          insertMarkdown(
                            '\n> 💡 **Lekcja z warsztatu:** ',
                            '\n\n',
                            'Kiedy układ odmawia posłuszeństwa, zacznij od diagnostyki zasilania i masy, a nie od przepisywania programu.'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                        title="Wstaw wyróżnioną ramkę z lekcją z warsztatu"
                      >
                        💡 Lekcja
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          insertMarkdown(
                            '\n> ⚠️ **Uwaga techniczna:** ',
                            '\n\n',
                            'Przed przystąpieniem do jakichkolwiek prac upewnij się, że napięcie zostało odłączone i zablokowane (LOTO).'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40"
                        title="Wstaw ostrzeżenie / ramkę uwagi"
                      >
                        ⚠️ Uwaga
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          insertMarkdown(
                            '\n```plc\n',
                            '\n```\n',
                            '// Przykładowa sekwencja logiki drabinkowej\nIF StartBtn AND NOT SafetyStop THEN\n    MotorRun := TRUE;\nEND_IF;'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40"
                        title="Blok kodu"
                      >
                        &lt;/&gt; Kod
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('[', '](https://...)', 'tekst odnośnika')}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10"
                        title="Link"
                      >
                        🔗 Link
                      </button>
                      <button
                        type="button"
                        onClick={() => insertMarkdown('\n---\n\n')}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10"
                        title="Pozioma linia podziału"
                      >
                        --- Linia
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          insertMarkdown(
                            '\n| Zagadnienie | Teoria | Praktyka warsztatowa |\n|---|---|---|\n| Diagnostyka | Schemat ideowy | Pomiary pod obciążeniem |\n| Programowanie | Czysta logika | Odporność na błędy operatora |\n\n'
                          )
                        }
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/15 text-gray-200 border border-white/10"
                        title="Tabela Markdown"
                      >
                        📊 Tabela
                      </button>
                    </div>

                    {/* Przełącznik trybu widoku + Asystent podpowiedzi */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPromptsPanel(!showPromptsPanel)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                          showPromptsPanel
                            ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                            : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
                        }`}
                        title="Włącz/wyłącz boczny panel podpowiedzi i gotowych szablonów"
                      >
                        <span>💡</span>
                        <span>Podpowiedzi</span>
                      </button>

                      <div className="flex rounded-lg bg-black/40 p-0.5 border border-white/10">
                        <button
                          type="button"
                          onClick={() => setEditorViewMode('editor')}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                            editorViewMode === 'editor' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Edytor
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorViewMode('split')}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                            editorViewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Podział (Split)
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditorViewMode('preview')}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                            editorViewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          Podgląd
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Panel Podpowiedzi i Szablonów Twórcy (Rozwijany) */}
                  {showPromptsPanel && (
                    <div className="p-3.5 bg-[#131b2e] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <span>⚡</span>
                          <span>Gotowe klocki Rafała (kliknij, by wstawić):</span>
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            insertMarkdown(
                              'Przez całe dekady słyszeliśmy, że wąska specjalizacja to jedyna droga. Jednak gdy sam stanąłem przed problemem w warsztacie, rzeczywistość brutalnie zweryfikowała tę teorię...\n\n'
                            )
                          }
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                        >
                          + Wstęp z haczykiem
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertMarkdown(
                              '\n> 🔧 **Lekcja z warsztatu:** Teoria z podręczników mówi jedno, ale gdy maszyna zatrzymuje się na linii o 2:00 w nocy, liczy się tylko zimna krew i systematyczna eliminacja punktów awarii.\n\n'
                            )
                          }
                          className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        >
                          + Lekcja z awarii
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertMarkdown(
                              '\n| Etap | Błąd początkującego | Podejście praktyka |\n|---|---|---|\n| 1. Analiza | Wymiana elementów na ślepo | Pomiar sygnałów oscyloskopem |\n| 2. Wdrożenie | Brak dokumentacji zmian | Czytelny schemat i wersjonowanie |\n\n'
                            )
                          }
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                        >
                          + Tabela: Błąd vs Praktyk
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertMarkdown(
                              '\nNie musisz wiedzieć wszystkiego od razu. Wystarczy, że nie boisz się pytać i każdego dnia budujesz choć jeden namacalny artefakt. A jak to wygląda w Twoim warsztacie?\n\n'
                            )
                          }
                          className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        >
                          + Podsumowanie i konkluzja
                        </button>
                      </div>

                      <div className="text-[11px] text-gray-400 font-mono">
                        Podpowiedź: Używaj `## ` dla rozdziałów i `&gt; ` dla złotych myśli.
                      </div>
                    </div>
                  )}

                  {/* Przestrzeń Edytora & Podglądu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 min-h-[460px]">
                    {/* Kolumna 1: Kod Markdown */}
                    {(editorViewMode === 'editor' || editorViewMode === 'split') && (
                      <div className={`p-4 flex flex-col ${editorViewMode === 'editor' ? 'col-span-2' : ''}`}>
                        <div className="flex justify-between items-center text-[11px] text-gray-400 uppercase tracking-wider mb-2 font-mono">
                          <span>Treść (Markdown)</span>
                          <span>Wiersze i formatowanie</span>
                        </div>
                        <textarea
                          ref={textareaRef}
                          id="post-content-editor"
                          value={postContent}
                          onChange={(e) => setPostContent(e.target.value)}
                          required
                          placeholder="Zacznij pisać esej w formacie Markdown... Możesz używać nagłówków ##, list -, bloków kodu ``` oraz ramek > 💡"
                          className="w-full flex-1 min-h-[380px] bg-transparent text-gray-200 font-mono text-sm leading-relaxed p-2 outline-none resize-y placeholder-gray-600 focus:ring-0"
                        />
                      </div>
                    )}

                    {/* Kolumna 2: Podgląd na żywo */}
                    {(editorViewMode === 'preview' || editorViewMode === 'split') && (
                      <div className={`p-4 sm:p-6 overflow-y-auto max-h-[550px] bg-[#070b14] ${editorViewMode === 'preview' ? 'col-span-2' : ''}`}>
                        <div className="flex justify-between items-center text-[11px] text-indigo-400 uppercase tracking-wider mb-4 pb-2 border-b border-white/10 font-mono">
                          <span>Podgląd na żywo</span>
                          <span className="text-gray-500">Wygląd na blogu</span>
                        </div>

                        {postTitle && (
                          <h1 className="text-2xl font-extrabold text-white mb-4 pb-2 border-b border-white/10">
                            {postTitle}
                          </h1>
                        )}

                        {postContent.trim() ? (
                          <MarkdownView content={postContent} theme="dark" enableDropCap={false} />
                        ) : (
                          <p className="text-xs text-gray-600 italic py-8 text-center">
                            Podgląd sformatowanego tekstu pojawi się tutaj po wpisaniu treści w edytorze.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pasek statystyk na dole edytora */}
                  <div className="p-3 bg-[#111928] border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-gray-400 font-mono">
                    <div className="flex items-center gap-4">
                      <span>Słowa: <strong className="text-white">{editorStats.words}</strong></span>
                      <span>Znaki: <strong className="text-white">{editorStats.chars}</strong></span>
                      <span>Akapity: <strong className="text-white">{editorStats.paragraphs}</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>⏱ Szacowany czas czytania: <strong className="text-indigo-400">~{editorStats.readTimeMinutes} min</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dolny pasek zapisu */}
              <div className="p-4 border-t border-white/10 bg-[#1e293b]/70 flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  {isEditingExistingPost
                    ? `Edytujesz wpis: "${editingPostOriginalSlug}"`
                    : 'Tworzysz nowy artykuł'}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPostEditorOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-all"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleSavePost}
                    disabled={loading || !postTitle.trim() || !postContent.trim()}
                    className="px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <span>{loading ? 'Zapisywanie...' : '💾 Zapisz artykuł'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL EDYCJI PRODUKTU / PROJEKTU                                         */}
        {/* ========================================================================= */}
        {productEditorOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#111827] border border-white/15 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden animate-scaleIn">
              <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      Edycja Produktu / Projektu
                    </h3>
                    <span className="text-xs text-gray-400 font-mono">
                      /produkty/{editingProductSlug}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setProductEditorOpen(false)}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-1">Nazwa produktu</label>
                    <input
                      type="text"
                      value={prodForm.title}
                      onChange={(e) => setProdForm({ ...prodForm, title: e.target.value })}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-1">Status</label>
                    <select
                      value={prodForm.status}
                      onChange={(e) => setProdForm({ ...prodForm, status: e.target.value })}
                      className="w-full bg-[#1f2937] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                    >
                      <option value="Szkic">🔒 Szkic (tylko w Projektach)</option>
                      <option value="Zapowiedź">🟣 Zapowiedź (w Katalogu, zbieranie zapisów)</option>
                      <option value="W przygotowaniu">🚀 W przygotowaniu</option>
                      <option value="W realizacji">⏳ W realizacji</option>
                      <option value="Dostępny">✅ Dostępny</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase text-gray-400 font-semibold block mb-1">Nagłówek (Headline)</label>
                  <input
                    type="text"
                    value={prodForm.headline}
                    onChange={(e) => setProdForm({ ...prodForm, headline: e.target.value })}
                    required
                    placeholder="np. Odkryj swój potencjał. Zakoduj swoją przewagę."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase text-gray-400 font-semibold block mb-1">Krótkie hasło (Tagline)</label>
                  <input
                    type="text"
                    value={prodForm.tagline}
                    onChange={(e) => setProdForm({ ...prodForm, tagline: e.target.value })}
                    placeholder="Krótki opis z korzyścią na liście produktów"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-1">Cena (etykieta)</label>
                    <input
                      type="text"
                      value={prodForm.price}
                      onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                      required
                      placeholder="np. 297 zł lub Przedsprzedaż wkrótce"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase text-gray-400 font-semibold block mb-1">Odznaka / Badge</label>
                    <input
                      type="text"
                      value={prodForm.badge}
                      onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value })}
                      placeholder="np. Flagowy program, Nowość, Rekomendowany"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase text-gray-400 font-semibold block mb-1">Pełny opis produktu</label>
                  <textarea
                    rows={5}
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    required
                    placeholder="Opis programu, celów i problemu, który rozwiązuje ten produkt..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3.5 text-sm text-white focus:border-indigo-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setProductEditorOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Zapisywanie...' : 'Zapisz produkt'}
                  </button>
                </div>
              </form>
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
                    <div className="p-4 rounded-xl bg-black/40 border border-white/5 max-h-[50vh] overflow-y-auto">
                      <MarkdownView
                        content={(previewModal.data as AdminPost).content}
                        theme="dark"
                        enableDropCap={false}
                      />
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
