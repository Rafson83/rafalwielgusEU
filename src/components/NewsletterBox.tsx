'use client';

import React, { useState } from 'react';

interface NewsletterBoxProps {
  className?: string;
  source?: string;
}

export default function NewsletterBox({ className = '', source = 'blog' }: NewsletterBoxProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [devUrl, setDevUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setMessage(null);
    setDevUrl(null);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
        setMessage(data.message);
        if (data.devConfirmUrl) {
          setDevUrl(data.devConfirmUrl);
        }
        setEmail('');
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
      }
    } catch {
      setIsSuccess(false);
      setMessage('Błąd połączenia z serwerem. Sprawdź łącze i spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`border border-[#181817] bg-[#ede7dc]/60 p-8 sm:p-12 shadow-[8px_8px_0_#181817] ${className}`}
    >
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-[#181817] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
            Newsletter
          </span>
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">
            Wtorki & Czwartki &bull; 09:00
          </span>
        </div>

        <h3 className="mt-5 font-serif text-[clamp(1.75rem,4vw,2.75rem)] font-black leading-[1.05] tracking-[-0.03em] text-[#181817]">
          Myśli, technika i człowiek prosto do Twojej skrzynki.
        </h3>

        <p className="mt-4 font-sans text-base leading-7 text-[#514f49] sm:text-lg">
          Zero spamu, clickbaitów i taniego coachingu. W każdy wtorek i czwartek o 09:00 otrzymasz konkretny esej z pierwszej linii — o technologii, automatyzacji przemysłowej, psychologii decyzji i idei <strong>Long-Life Learning</strong>.
        </p>

        {isSuccess ? (
          <div className="mt-8 border border-[#181817] bg-white p-6 shadow-[4px_4px_0_#181817]">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#181817] text-white font-bold">
                ✓
              </span>
              <div>
                <p className="font-serif text-lg font-bold text-[#181817]">Dziękuję za zapis!</p>
                <p className="mt-1 font-sans text-sm text-[#514f49]">{message}</p>
              </div>
            </div>

            {devUrl && (
              <div className="mt-4 border-t border-[#181817]/20 pt-4">
                <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-[#e85d3f]">
                  Tryb deweloperski (lokalny test bez Resend API):
                </span>
                <p className="mt-1 font-sans text-xs text-[#514f49]">
                  Kliknij poniższy link, aby zasymulować potwierdzenie z maila:
                </p>
                <a
                  href={devUrl}
                  className="mt-2 inline-block font-sans text-xs font-bold text-[#181817] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#e85d3f]"
                >
                  Potwierdź subskrypcję teraz &rarr;
                </a>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj.email@domena.pl"
                className="w-full border border-[#181817] bg-white px-5 py-3.5 font-sans text-sm text-[#181817] placeholder:text-[#88857d] focus:outline-none focus:ring-2 focus:ring-[#e85d3f] sm:max-w-md"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex shrink-0 items-center justify-center bg-[#181817] px-7 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e85d3f] disabled:opacity-50"
              >
                {loading ? 'Zapisywanie...' : 'Zapisz się →'}
              </button>
            </div>

            {message && !isSuccess && (
              <p className="mt-3 font-sans text-xs font-bold text-[#e85d3f]">{message}</p>
            )}

            <p className="mt-4 font-sans text-xs text-[#6b6860]">
              Szanuję Twoją prywatność. Żadnego spamu. Zawsze możesz wypisać się jednym kliknięciem.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
