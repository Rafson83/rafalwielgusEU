'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface CommentItem {
  id: number;
  postSlug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  isAuthorReply?: boolean;
  parentId?: number | null;
  createdAt: string;
}

interface CommentsSectionProps {
  postSlug: string;
}

export default function CommentsSection({ postSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Formularz
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [replyingTo, setReplyingTo] = useState<CommentItem | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  const formRenderTimeRef = useRef<number>(Date.now());

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Błąd pobierania komentarzy:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    formRenderTimeRef.current = Date.now();
    fetchComments();
  }, [postSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const cleanName = authorName.trim();
    const cleanContent = content.trim();

    if (!cleanName || !cleanContent) {
      setFeedback({
        type: 'error',
        text: 'Wypełnij wymagane pola: Twój podpis oraz treść komentarza.',
      });
      return;
    }

    if (cleanContent.length < 5) {
      setFeedback({
        type: 'error',
        text: 'Treść komentarza jest zbyt krótka (minimum 5 znaków).',
      });
      return;
    }

    setSubmitting(true);
    const timeElapsedSeconds = Math.round((Date.now() - formRenderTimeRef.current) / 1000);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug,
          authorName: cleanName,
          authorEmail: authorEmail.trim() || undefined,
          content: cleanContent,
          honeypot,
          timeElapsedSeconds,
          parentId: replyingTo ? replyingTo.id : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Nie udało się przesłać komentarza.');
      }

      if (data.comment?.status === 'approved') {
        setFeedback({
          type: 'success',
          text: 'Twój komentarz został opublikowany. Dziękuję za udział w dyskusji!',
        });
        // Odśwież listę
        fetchComments();
      } else if (data.comment?.status === 'pending') {
        setFeedback({
          type: 'warning',
          text: 'Dziękujemy! Twój komentarz został przesłany i oczekuje na weryfikację moderacyjną.',
        });
      } else {
        setFeedback({
          type: 'error',
          text: 'Komentarz został zatrzymany przez filtr antyspamowy. Jeśli uważasz to za pomyłkę, napisz bezpośrednio na hello@rafalwielgus.eu.',
        });
      }

      // Reset formularza
      setContent('');
      setReplyingTo(null);
      formRenderTimeRef.current = Date.now();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Wystąpił błąd podczas dodawania komentarza.';
      setFeedback({ type: 'error', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  // Organizacja komentarzy w wątki (rodzic -> odpowiedzi)
  const topLevelComments = comments.filter((c) => !c.parentId);
  const repliesByParent = comments.reduce<Record<number, CommentItem[]>>((acc, curr) => {
    if (curr.parentId) {
      acc[curr.parentId] = acc[curr.parentId] || [];
      acc[curr.parentId].push(curr);
    }
    return acc;
  }, {});

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <section id="komentarze" className="mx-auto mt-16 max-w-3xl border-t border-[#181817] pt-14">
      {/* Nagłówek sekcji */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#181817] pb-6">
        <div>
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
            Kultura dyskusji & warsztat
          </span>
          <h3 className="mt-1 font-serif text-3xl font-black tracking-tight sm:text-4xl">
            Dyskusja warsztatowa
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center bg-[#181817] px-3 py-1 font-sans text-xs font-bold text-[#f4f0e9]">
            {comments.length} {comments.length === 1 ? 'wpis' : comments.length >= 2 && comments.length <= 4 ? 'wpisy' : 'wpisów'}
          </span>
        </div>
      </div>

      <p className="mt-4 font-sans text-sm leading-relaxed text-[#514f49]">
        Miejsce na wymianę doświadczeń, polemikę i techniczne pytania. Komentarze podlegają automatycznej ocenie jakościowej oraz moderacji autorskiej. Dbamy o merytoryczny konkret i wzajemny szacunek.
      </p>

      {/* Lista opublikowanych komentarzy */}
      <div className="mt-10 space-y-6">
        {loading ? (
          <div className="py-12 text-center font-sans text-sm text-[#514f49]">
            <div className="inline-block h-6 w-6 animate-spin border-2 border-[#181817] border-t-[#e85d3f]"></div>
            <p className="mt-2">Wczytuję dyskusję...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="border border-dashed border-[#181817]/30 bg-[#ede7dc]/40 p-8 text-center">
            <p className="font-serif text-xl font-bold text-[#181817]">Brak komentarzy pod tym artykułem</p>
            <p className="mt-2 font-sans text-sm text-[#514f49]">
              Bądź pierwszą osobą, która podzieli się swoją opinią lub perspektywą warsztatową!
            </p>
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <div
              key={comment.id}
              className="border border-[#181817] bg-[#f4f0e9] p-5 sm:p-6 shadow-[3px_3px_0_#181817]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#181817] bg-[#ede7dc] font-serif text-sm font-bold text-[#181817]">
                    {comment.authorName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-[#181817]">{comment.authorName}</h4>
                    <span className="font-sans text-[11px] text-[#514f49]">{formatDate(comment.createdAt)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setReplyingTo(comment);
                    document.getElementById('formularz-komentarza')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="font-sans text-xs font-bold text-[#e85d3f] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#181817]"
                >
                  Odpowiedz &rarr;
                </button>
              </div>

              <div className="mt-4 font-serif text-base leading-relaxed text-[#181817] whitespace-pre-line">
                {comment.content}
              </div>

              {/* Odpowiedzi do tego komentarza */}
              {repliesByParent[comment.id] && repliesByParent[comment.id].length > 0 && (
                <div className="mt-6 border-l-2 border-[#181817] pl-4 sm:pl-6 space-y-4">
                  {repliesByParent[comment.id].map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-4 border border-[#181817] ${
                        reply.isAuthorReply
                          ? 'bg-[#181817] text-[#f4f0e9] shadow-[3px_3px_0_#e85d3f]'
                          : 'bg-[#ede7dc]/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          {reply.isAuthorReply ? (
                            <div className="flex h-8 w-8 items-center justify-center border border-white/20 bg-[#e85d3f] font-serif text-xs font-bold text-white">
                              RW
                            </div>
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center border border-[#181817] bg-[#f4f0e9] font-serif text-xs font-bold text-[#181817]">
                              {reply.authorName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-sans text-xs font-bold">
                                {reply.authorName}
                              </span>
                              {reply.isAuthorReply && (
                                <span className="bg-[#e85d3f] px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-white">
                                  Autor
                                </span>
                              )}
                            </div>
                            <span className={`font-sans text-[10px] ${reply.isAuthorReply ? 'text-white/60' : 'text-[#514f49]'}`}>
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 font-serif text-sm leading-relaxed whitespace-pre-line">
                        {reply.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Formularz dodawania komentarza */}
      <div id="formularz-komentarza" className="mt-12 border border-[#181817] bg-[#ede7dc]/40 p-6 sm:p-8 shadow-[4px_4px_0_#181817]">
        <div className="flex items-center justify-between border-b border-[#181817]/20 pb-4">
          <div>
            <h4 className="font-serif text-2xl font-bold text-[#181817]">
              {replyingTo ? `Odpowiedź na komentarz (${replyingTo.authorName})` : 'Zabierz głos w dyskusji'}
            </h4>
            <p className="mt-1 font-sans text-xs text-[#514f49]">
              Komentarze są publikowane po automatycznej weryfikacji antyspamowej.
            </p>
          </div>
          {replyingTo && (
            <button
              type="button"
              onClick={() => setReplyingTo(null)}
              className="font-sans text-xs font-bold text-[#514f49] hover:text-[#e85d3f] underline"
            >
              Anuluj odpowiedź
            </button>
          )}
        </div>

        {feedback && (
          <div
            className={`mt-4 border p-4 font-sans text-sm ${
              feedback.type === 'success'
                ? 'border-green-600 bg-green-50 text-green-800'
                : feedback.type === 'warning'
                ? 'border-amber-600 bg-amber-50 text-amber-900'
                : 'border-red-600 bg-red-50 text-red-800'
            }`}
          >
            {feedback.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Honeypot field - ukryte przed ludźmi */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="user_company_hp">Firma</label>
            <input
              type="text"
              id="user_company_hp"
              name="user_company_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="authorName" className="block font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                Twój podpis / Imię <span className="text-[#e85d3f]">*</span>
              </label>
              <input
                type="text"
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="np. Tomek (automatyk)"
                required
                maxLength={80}
                className="mt-1.5 w-full border border-[#181817] bg-[#f4f0e9] px-3.5 py-2.5 font-sans text-sm text-[#181817] outline-none transition-colors focus:border-[#e85d3f]"
              />
            </div>

            <div>
              <label htmlFor="authorEmail" className="block font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                Adres e-mail <span className="text-xs text-[#514f49] lowercase font-normal">(niewidoczny publicznie)</span>
              </label>
              <input
                type="email"
                id="authorEmail"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="twoj@email.pl"
                maxLength={100}
                className="mt-1.5 w-full border border-[#181817] bg-[#f4f0e9] px-3.5 py-2.5 font-sans text-sm text-[#181817] outline-none transition-colors focus:border-[#e85d3f]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="commentContent" className="block font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                Treść wypowiedzi <span className="text-[#e85d3f]">*</span>
              </label>
              <span className="font-sans text-[11px] text-[#514f49]">
                {content.length}/3000 znaków
              </span>
            </div>
            <textarea
              id="commentContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Napisz swój komentarz, zadaj pytanie lub podziel się doświadczeniem..."
              rows={4}
              required
              maxLength={3000}
              className="mt-1.5 w-full border border-[#181817] bg-[#f4f0e9] p-3.5 font-serif text-base text-[#181817] outline-none transition-colors focus:border-[#e85d3f]"
            ></textarea>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="font-sans text-[11px] text-[#514f49]">
              💡 Wskazówka: Unikaj linków promocyjnych, by Twój wpis nie trafił do kolejki spamu.
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center bg-[#181817] px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-[#f4f0e9] transition-all hover:bg-[#e85d3f] disabled:opacity-50"
            >
              {submitting ? 'Weryfikuję...' : replyingTo ? 'Wyślij odpowiedź →' : 'Dodaj komentarz →'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
