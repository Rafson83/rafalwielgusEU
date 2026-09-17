'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getProductBySlug } from '@/lib/products';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Navbar />

          <div className="my-20 border border-[#181817] bg-[#ede7dc]/40 p-12 text-center sm:p-16">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
              Błąd 404
            </span>
            <h1 className="mt-4 font-serif text-3xl font-black sm:text-5xl">
              Produkt nie został odnaleziony
            </h1>
            <p className="mx-auto mt-4 max-w-md font-sans text-base text-[#514f49]">
              Wygląda na to, że ten produkt nie istnieje w katalogu lub został wycofany.
            </p>
            <div className="mt-8">
              <Link
                href="/produkty"
                className="bg-[#181817] px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e85d3f]"
              >
                &larr; Wróć do katalogu produktów
              </Link>
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

        {/* Back Link */}
        <div className="pt-8">
          <Link
            href="/produkty"
            className="inline-flex items-center font-sans text-xs font-bold uppercase tracking-wider text-[#514f49] transition-colors hover:text-[#e85d3f]"
          >
            &larr; Wróć do katalogu produktów
          </Link>
        </div>

        {/* Product Hero */}
        <section className="border-b border-[#181817] py-12 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#e85d3f] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
                  {product.badge}
                </span>
                <span className="border border-[#181817] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                  {product.category}
                </span>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">
                  &bull; {product.statusLabel}
                </span>
              </div>

              <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[0.95] tracking-[-0.04em]">
                {product.title}
              </h1>

              <p className="mt-4 font-serif text-2xl font-bold italic text-[#e85d3f]">
                „{product.headline}”
              </p>

              <p className="mt-6 font-sans text-base leading-7 text-[#514f49] sm:text-lg">
                {product.description}
              </p>
            </div>

            {/* Sticky/Side Purchase/Waitlist Box */}
            <div className="border-2 border-[#181817] bg-[#ede7dc] p-8 shadow-[8px_8px_0_#181817]">
              <div className="border-b border-[#181817]/20 pb-4">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#514f49]">
                  Inwestycja w rozwój
                </span>
                <div className="mt-2 font-serif text-3xl font-black text-[#181817]">
                  {product.price}
                </div>
                {product.priceNote && (
                  <p className="mt-1 font-sans text-xs text-[#514f49]">{product.priceNote}</p>
                )}
              </div>

              <div className="mt-6">
                {submitted ? (
                  <div className="border border-[#181817] bg-[#181817] p-5 text-[#f4f0e9]">
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">
                      ✓ Jesteś na liście!
                    </span>
                    <p className="mt-2 font-serif text-base font-bold">
                      Dziękuję za zaufanie.
                    </p>
                    <p className="mt-1 font-sans text-xs text-[#f4f0e9]/80">
                      Otrzymasz powiadomienie jako pierwszy oraz specjalny bonus na adres: <strong>{email}</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                    <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                      Dołącz do listy oczekujących (Early Bird):
                    </p>
                    <input
                      type="email"
                      required
                      placeholder="Twój adres e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-[#181817] bg-white px-4 py-3 font-sans text-sm outline-none focus:border-[#e85d3f]"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#181817] py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e85d3f]"
                    >
                      {product.ctaText} &rarr;
                    </button>
                    <p className="font-sans text-[11px] text-[#514f49]">
                      Zero spamu. Tylko konkretne informacje o premierze i darmowe materiały.
                    </p>
                  </form>
                )}
              </div>

              <div className="mt-8 border-t border-[#181817]/20 pt-6 space-y-3 font-sans text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#e85d3f]">✓</span>
                  <span>Dostęp do zamkniętych materiałów</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#e85d3f]">✓</span>
                  <span>Gwarancja najniższej ceny w przedsprzedaży</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#e85d3f]">✓</span>
                  <span>Praktyczne zadania i szablony wdrożeniowe</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Outcomes Section: Z czym dokładnie kończysz */}
        <section className="border-b border-[#181817] py-14 sm:py-20">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
            Konkretne rezultaty
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Z czym dokładnie kończysz ten program?
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {product.outcomes.map((item, idx) => (
              <div
                key={idx}
                className="border border-[#181817] bg-[#ede7dc]/30 p-8 shadow-[4px_4px_0_#181817]"
              >
                <span className="font-serif text-3xl font-black text-[#e85d3f]">0{idx + 1}</span>
                <h3 className="mt-4 font-serif text-xl font-bold">{item.title}</h3>
                <p className="mt-3 font-sans text-sm leading-6 text-[#514f49]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Modules / Program Syllabus (If available) */}
        {product.modules && product.modules.length > 0 && (
          <section className="border-b border-[#181817] py-14 sm:py-20">
            <div className="mb-12">
              <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
                Szczegółowy program
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                4 Moduły. 20 Lekcji. Zero lania wody.
              </h2>
              <p className="mt-2 max-w-xl font-sans text-sm text-[#514f49]">
                Krok po kroku: od psychologicznej diagnozy tożsamości aż po działającą stronę WWW na Twojej własnej subdomenie.
              </p>
            </div>

            <div className="space-y-8">
              {product.modules.map((m) => (
                <div
                  key={m.number}
                  className="border border-[#181817] bg-[#ede7dc]/20 p-6 sm:p-8"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between border-b border-[#181817]/20 pb-4">
                    <div className="flex items-baseline gap-4">
                      <span className="font-serif text-3xl font-black text-[#e85d3f]">
                        {m.number}
                      </span>
                      <h3 className="font-serif text-2xl font-bold">
                        {m.title}
                      </h3>
                    </div>
                    <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#514f49]">
                      5 lekcji wdrożeniowych
                    </span>
                  </div>

                  <p className="mt-4 font-sans text-sm text-[#514f49]">
                    {m.description}
                  </p>

                  <div className="mt-6 border-t border-[#181817]/10 pt-4">
                    <ul className="space-y-2.5 font-sans text-sm text-[#181817]">
                      {m.lessons.map((lesson, lIdx) => (
                        <li key={lIdx} className="flex items-start gap-3">
                          <span className="mt-1 text-xs text-[#e85d3f]">▸</span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Target Audience: Dla kogo / Dla kogo NIE */}
        <section className="border-b border-[#181817] py-14 sm:py-20">
          <div className="mb-10">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
              Dopasowanie
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Czy ten program jest dla Ciebie?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="border-2 border-[#181817] bg-[#ede7dc]/40 p-8 shadow-[6px_6px_0_#181817]">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#181817] text-sm font-bold text-white">
                  ✓
                </span>
                <h3 className="font-serif text-2xl font-bold">Ten produkt JEST dla Ciebie, jeśli:</h3>
              </div>
              <ul className="mt-6 space-y-4 font-sans text-sm leading-6 text-[#514f49]">
                {product.forWhom.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-[#e85d3f] font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-2 border-[#181817] bg-[#ede7dc]/20 p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#181817] bg-white text-sm font-bold text-[#181817]">
                  ✕
                </span>
                <h3 className="font-serif text-2xl font-bold">Ten produkt NIE JEST dla Ciebie, jeśli:</h3>
              </div>
              <ul className="mt-6 space-y-4 font-sans text-sm leading-6 text-[#514f49]">
                {product.notForWhom.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-[#181817] font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Author Note */}
        <section className="border-b border-[#181817] py-14 sm:py-20">
          <div className="border border-[#181817] bg-[#ede7dc] p-8 sm:p-12 shadow-[6px_6px_0_#181817]">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
              Słowo od twórcy
            </span>
            <h3 className="mt-3 font-serif text-3xl font-bold">
              Dlaczego stworzyłem ten program?
            </h3>
            <div className="mt-6 space-y-4 font-sans text-base leading-7 text-[#514f49]">
              <p>
                Sam przeszedłem przez bankructwo, korporację i zmianę branży. Wiem, jak paraliżujące jest wysyłanie setek CV i otrzymywanie głuchych automatycznych odpowiedzi.
              </p>
              <p>
                Wierzę, że w świecie AI i automatyzacji wygrywają ci, którzy łączą <strong>autorefleksję (znajomość własnych mocnych stron)</strong> z <strong>odwagą do posługiwania się technologią</strong>. Zamiast płacić tysiące złotych za kosmetyczne poprawki pliku PDF, naucz się budować własne narzędzia i stwórz stronę, która mówi za Ciebie.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4 border-t border-[#181817]/20 pt-6">
              <div className="flex h-12 w-12 items-center justify-center border border-[#181817] bg-[#181817] font-serif text-lg font-bold text-white">
                RW<span className="text-[#e85d3f]">.</span>
              </div>
              <div>
                <p className="font-serif text-lg font-bold">Rafał Wielgus</p>
                <p className="font-sans text-xs text-[#514f49]">
                  Twórca programu &bull; Technik elektronik &bull; Utrzymanie ruchu & AI
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="border-b border-[#181817] py-14 sm:py-20">
          <div className="mb-10">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
              Wątpliwości & Pytania
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Często zadawane pytania (FAQ)
            </h2>
          </div>

          <div className="space-y-6">
            {product.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-[#181817] bg-[#ede7dc]/30 p-6 sm:p-8"
              >
                <h4 className="font-serif text-xl font-bold text-[#181817]">
                  {faq.question}
                </h4>
                <p className="mt-3 font-sans text-sm leading-6 text-[#514f49]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-14 sm:py-20 text-center">
          <div className="mx-auto max-w-2xl border-2 border-[#181817] bg-[#ede7dc] p-10 shadow-[8px_8px_0_#181817] sm:p-14">
            <h3 className="font-serif text-3xl font-black sm:text-4xl">
              Gotowy, by zakodować swoją przewagę?
            </h3>
            <p className="mt-4 font-sans text-base text-[#514f49]">
              Zapisz się na listę oczekujących. Jako pierwszy otrzymasz dostęp do materiałów, zniżkę early-bird oraz darmowy arkusz audytu tożsamości zawodowej.
            </p>

            <div className="mt-8 flex justify-center">
              {submitted ? (
                <p className="font-sans text-sm font-bold text-[#e85d3f]">
                  ✓ Dziękujemy! Twój e-mail ({email}) został dodany do listy oczekujących.
                </p>
              ) : (
                <form
                  onSubmit={handleWaitlistSubmit}
                  className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    placeholder="Wpisz swój e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 border border-[#181817] bg-white px-4 py-3 font-sans text-sm outline-none focus:border-[#e85d3f]"
                  />
                  <button
                    type="submit"
                    className="bg-[#181817] px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e85d3f]"
                  >
                    Zapisz się &rarr;
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer id="kontakt" className="flex flex-col justify-between gap-8 border-t border-[#181817] py-10 font-sans sm:flex-row sm:items-end">
          <div>
            <p className="font-serif text-3xl font-bold tracking-[-0.04em]">Rafał Wielgus</p>
            <a href="mailto:hello@rafalwielgus.eu" className="mt-2 inline-block text-sm text-[#514f49] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#e85d3f]">
              hello@rafalwielgus.eu
            </a>
          </div>
          <p className="text-xs uppercase tracking-[0.15em] text-[#514f49]">&copy; 2026 Rafał Wielgus</p>
        </footer>
      </div>
    </main>
  );
}
