'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  slug: string;
  category: string;
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

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'projects'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postSlug, setPostSlug] = useState('');
  const [postCategory, setPostCategory] = useState('programowanie');
  const [postContent, setPostContent] = useState('');
  const [postPublished, setPostPublished] = useState(false);

  // Project Form State
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectTech, setProjectTech] = useState('');
  const [projectLink, setProjectLink] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Fetch list of current posts/projects
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
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
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
          published: postPublished,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Nie udało się dodać artykułu');

      setMessage({ text: 'Artykuł został pomyślnie dodany!', type: 'success' });
      setPostTitle('');
      setPostSlug('');
      setPostContent('');
      setPostPublished(false);
      fetchData();
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
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
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
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
        </div>

        {/* Forms & Lists Grid */}
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
                      <option value="psychologia">Psychologia (Psychelandia)</option>
                      <option value="biznes">Biznes & Zarządzanie</option>
                      <option value="sprzedaz">Sprzedaż</option>
                      <option value="elektronika">Elektronika & Energetyka</option>
                      <option value="programowanie">Programowanie & IT</option>
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
      </div>
    </main>
  );
}
