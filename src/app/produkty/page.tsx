import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllProducts } from '@/lib/products';

export const metadata: Metadata = {
  title: 'Moje Produkty — Rafał Wielgus',
  description:
    'Praktyczne produkty cyfrowe, szablony i kursy wspierające filozofię Long-Life Learning i interdyscyplinarny rozwój. Poznaj kurs Kod Kariery.',
};

export default function ProductsPage() {
  const products = getAllProducts();
  const flagship = products.find((p) => p.isFlagship);
  const otherProducts = products.filter((p) => !p.isFlagship);

  return (
    <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Navbar />

        {/* Hero Section */}
        <section className="border-b border-[#181817] py-14 sm:py-20">
          <div className="max-w-4xl">
            <p className="mb-6 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#e85d3f]">
              03 / Produkty Cyfrowe & Edukacja
            </p>
            <h1 className="font-serif text-[clamp(2.75rem,7vw,6.5rem)] font-black leading-[0.92] tracking-[-0.05em]">
              Narzędzia i wiedza dla interdyscyplinarnych umysłów.
            </h1>
            <p className="mt-8 max-w-2xl font-sans text-lg leading-8 text-[#514f49] sm:text-xl">
              Praktyczne kursy, szablony i przewodniki wspierające filozofię <strong>Long-Life Learning</strong>. Zero akademickiej teorii — wyłącznie sprawdzone narzędzia łączące technikę, psychologię i procesowe myślenie.
            </p>
          </div>
        </section>

        {/* Flagship Course: Kod Kariery */}
        {flagship && (
          <section className="border-b border-[#181817] py-14 sm:py-20">
            <div className="border-2 border-[#181817] bg-[#ede7dc]/40 p-6 shadow-[10px_10px_0_#181817] sm:p-12">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#181817]/20 pb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-[#e85d3f] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
                    {flagship.badge}
                  </span>
                  <span className="border border-[#181817] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                    {flagship.category}
                  </span>
                </div>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">
                  &bull; {flagship.statusLabel}
                </span>
              </div>

              <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
                <div>
                  <h2 className="font-serif text-3xl font-black tracking-tight sm:text-5xl">
                    {flagship.title}
                  </h2>
                  <p className="mt-4 font-serif text-xl font-bold italic text-[#e85d3f] sm:text-2xl">
                    „{flagship.headline}”
                  </p>
                  <p className="mt-6 font-sans text-base leading-7 text-[#514f49] sm:text-lg">
                    {flagship.description}
                  </p>

                  <div className="mt-8 space-y-4">
                    <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                      Co dokładnie zyskasz w tym programie:
                    </p>
                    <ul className="space-y-3 font-sans text-sm text-[#514f49]">
                      {flagship.outcomes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#181817] text-[10px] font-bold text-white">
                            ✓
                          </span>
                          <span>
                            <strong className="text-[#181817]">{item.title}:</strong> {item.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-10 flex flex-wrap items-center gap-5">
                    <Link
                      href={`/produkty/${flagship.slug}`}
                      className="inline-flex items-center gap-3 bg-[#181817] px-8 py-4 font-sans text-sm font-bold uppercase tracking-wider text-white transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_#e85d3f]"
                    >
                      Zobacz pełny program i zapisz się na listę <span className="text-[#e85d3f]">&rarr;</span>
                    </Link>
                  </div>
                </div>

                <div className="flex flex-col justify-between border border-[#181817] bg-[#181817] p-8 text-[#f4f0e9]">
                  <div>
                    <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
                      W pigułce
                    </span>
                    <h3 className="mt-4 font-serif text-2xl font-bold leading-snug">
                      Przestań być anonimowym plikiem PDF.
                    </h3>
                    <p className="mt-4 font-sans text-xs leading-relaxed text-[#f4f0e9]/80">
                      Większość kursów uczy tylko poprawiania szablonów CV. W Kodzie Kariery przeprowadzisz psychologiczny audyt mocnych stron i sam zakodujesz interaktywne CV opublikowane w sieci.
                    </p>

                    <div className="mt-8 border-t border-white/20 pt-6 space-y-3 font-sans text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/60">Liczba modułów:</span>
                        <span className="font-bold">4 moduły (20 lekcji)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Poziom techniczny:</span>
                        <span className="font-bold">Od absolutnego zera</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Finalny rezultat:</span>
                        <span className="font-bold">Działająca strona WWW</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-white/20 pt-6">
                    <span className="font-serif text-xl font-bold text-[#e85d3f]">{flagship.price}</span>
                    <p className="mt-1 font-sans text-[11px] text-white/60">{flagship.priceNote}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Secondary Products */}
        <section className="border-b border-[#181817] py-14 sm:py-20">
          <div className="mb-12">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
              Katalog
            </p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Pozostałe materiały i narzędzia
            </h2>
            <p className="mt-2 max-w-xl font-sans text-sm text-[#514f49]">
              Autorskie rozwiązania stworzone z myślą o systematycznym rozwoju osobistym i technicznym.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {otherProducts.map((prod) => (
              <article
                key={prod.id}
                className="group flex flex-col justify-between border border-[#181817] bg-[#ede7dc]/20 p-8 transition-all hover:-translate-y-1 hover:border-[#e85d3f] hover:shadow-[6px_6px_0_#181817]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="bg-[#181817] px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white">
                      {prod.category}
                    </span>
                    <span className="font-sans text-xs font-bold text-[#e85d3f]">
                      {prod.statusLabel}
                    </span>
                  </div>

                  <h3 className="mt-6 font-serif text-2xl font-bold tracking-tight transition-colors group-hover:text-[#e85d3f] sm:text-3xl">
                    <Link href={`/produkty/${prod.slug}`}>{prod.title}</Link>
                  </h3>

                  <p className="mt-2 font-serif text-base italic text-[#514f49]">
                    „{prod.headline}”
                  </p>

                  <p className="mt-4 font-sans text-sm leading-6 text-[#514f49]">
                    {prod.description}
                  </p>

                  <div className="mt-6 border-t border-[#181817]/10 pt-4">
                    <ul className="space-y-2 font-sans text-xs text-[#514f49]">
                      {prod.outcomes.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-[#e85d3f]">▸</span>
                          <span><strong>{item.title}</strong></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-[#181817]/20 pt-5">
                  <span className="font-serif text-lg font-bold text-[#181817]">{prod.price}</span>
                  <Link
                    href={`/produkty/${prod.slug}`}
                    className="inline-flex items-center font-sans text-xs font-bold uppercase tracking-wider text-[#181817] transition-colors hover:text-[#e85d3f]"
                  >
                    Dowiedz się więcej <span className="ml-1 text-[#e85d3f]">&rarr;</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Philosophy behind products */}
        <section className="py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
                Zasady tworzenia
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                Czego nigdy nie znajdziesz w moich materiałach?
              </h2>
              <p className="mt-6 font-sans text-base leading-7 text-[#514f49]">
                Rynek edukacji online jest zalany generycznymi e-bookami pisanymi przez sztuczną inteligencję w 5 minut oraz pustym motywacyjnym bełkotem. Moje podejście opiera się na technicznej i warsztatowej rzetelności.
              </p>
            </div>
            <div className="space-y-6">
              <div className="border-l-2 border-[#e85d3f] pl-5">
                <h4 className="font-serif text-xl font-bold">1. Zero pustej teorii bez narzędzi</h4>
                <p className="mt-1 font-sans text-sm leading-6 text-[#514f49]">
                  Każdy materiał kończy się namacalnym artefaktem: wdrożonym procesem, napisaną stroną WWW lub działającym systemem notatek.
                </p>
              </div>
              <div className="border-l-2 border-[#e85d3f] pl-5">
                <h4 className="font-serif text-xl font-bold">2. Prawdziwe lekcje z pierwszej linii frontu</h4>
                <p className="mt-1 font-sans text-sm leading-6 text-[#514f49]">
                  Wiedza płynie z realnych maszyn przemysłowych, zgaszonych awarii, korporacyjnego rygoru jakości i lekcji po upadku własnej firmy.
                </p>
              </div>
              <div className="border-l-2 border-[#e85d3f] pl-5">
                <h4 className="font-serif text-xl font-bold">3. Wsparcie filozofii Long-Life Learning</h4>
                <p className="mt-1 font-sans text-sm leading-6 text-[#514f49]">
                  Uczę myślenia interdyscyplinarnego i samodzielności. Nie daję ryby, lecz uczę, jak zbudować własną wędkę i nawigować w cyfrowym świecie.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
