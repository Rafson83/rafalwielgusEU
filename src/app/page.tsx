import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="flex items-center justify-between border-b border-[#181817] py-5">
          <Link href="/" className="font-sans text-sm font-bold uppercase tracking-[0.22em]">
            RW<span className="text-[#e85d3f]">.</span>
          </Link>
          <nav className="flex items-center gap-5 font-sans text-xs font-bold uppercase tracking-[0.14em] sm:gap-8">
            <Link href="#o-mnie" className="transition-colors hover:text-[#e85d3f]">O mnie</Link>
            <Link href="/blog" className="transition-colors hover:text-[#e85d3f]">Blog</Link>
            <Link href="#kontakt" className="border-b-2 border-[#e85d3f] pb-1 transition-colors hover:text-[#e85d3f]">Kontakt</Link>
          </nav>
        </header>

        <section className="grid min-h-[calc(100vh-81px)] items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:py-20">
          <div>
            <p className="mb-7 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#e85d3f]">Rafał Wielgus / 2026</p>
            <h1 className="max-w-5xl font-serif text-[clamp(3.5rem,9vw,8.5rem)] font-black leading-[0.84] tracking-[-0.055em]">
              Myślę.<br />
              <span className="text-[#e85d3f]">Buduję.</span><br />
              Piszę.
            </h1>
            <p className="mt-10 max-w-lg font-sans text-base leading-7 text-[#514f49] sm:text-lg">
              O ludziach, technologii i decyzjach, które robią różnicę. Bez pozy eksperta. Z ciekawością i konkretem.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6 font-sans text-sm font-bold">
              <Link href="/blog" className="bg-[#181817] px-6 py-4 text-white transition-transform hover:-translate-y-1">
                Czytaj blog <span className="ml-5 text-[#e85d3f]">→</span>
              </Link>
              <Link href="#o-mnie" className="border-b border-[#181817] pb-1 transition-colors hover:border-[#e85d3f] hover:text-[#e85d3f]">
                Poznaj mnie
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:justify-self-end">
            <div className="aspect-[4/5] rotate-2 bg-[#e85d3f] p-5 shadow-[14px_14px_0_#181817] sm:p-7">
              <div className="flex h-full flex-col justify-between border border-white/60 p-5 text-white sm:p-7">
                <div className="flex items-start justify-between font-sans text-[10px] font-bold uppercase tracking-[0.2em]">
                  <span>Notatnik<br />osobisty</span>
                  <span>01 / 01</span>
                </div>
                <p className="font-serif text-4xl font-bold leading-[0.92] tracking-[-0.04em] sm:text-5xl">
                  Dobre pytania są warte więcej niż szybkie odpowiedzi.
                </p>
                <div className="flex items-end justify-between font-sans text-xs font-bold uppercase tracking-[0.15em]">
                  <span>Rafał Wielgus</span>
                  <span>R.W.</span>
                </div>
              </div>
            </div>
            <span className="absolute -bottom-10 -left-5 font-serif text-7xl text-[#181817]/10 sm:-left-12">01</span>
          </div>
        </section>

        <section id="o-mnie" className="grid gap-8 border-t border-[#181817] py-16 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">01 / O mnie</p>
            <h2 className="mt-5 max-w-sm font-serif text-4xl font-bold leading-none tracking-[-0.04em] sm:text-5xl">Nie interesuje mnie robienie hałasu.</h2>
          </div>
          <div className="max-w-2xl font-sans text-lg leading-8 text-[#514f49]">
            <p>Interesuje mnie to, co zostaje, kiedy hałas ucichnie: sposób myślenia, jakość pracy i relacje, które wytrzymują próbę czasu.</p>
            <p className="mt-6">Ten blog jest miejscem na rzeczy niedokończone, ale ważne. Na obserwacje z pracy, rozmowy o rozwoju i narzędzia, które pomagają żyć odrobinę mądrzej.</p>
          </div>
        </section>

        <section className="border-t border-[#181817] py-16 sm:py-20">
          <div className="mb-10 flex items-end justify-between gap-5">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">02 / Kierunki</p>
              <h2 className="mt-4 font-serif text-4xl font-bold tracking-[-0.04em] sm:text-5xl">O czym piszę</h2>
            </div>
            <span className="hidden font-sans text-xs font-bold uppercase tracking-[0.15em] text-[#514f49] sm:block">Trzy obszary</span>
          </div>
          <div className="grid border-t border-[#181817] md:grid-cols-3">
            {[
              ['01', 'Psychologia', 'Jak rozumieć siebie, ludzi i decyzje, które podejmujemy każdego dnia.'],
              ['02', 'Technologia', 'Narzędzia są ciekawe. Jeszcze ciekawsze jest to, co dzięki nim tworzymy.'],
              ['03', 'Praca', 'O skupieniu, odpowiedzialności i budowaniu rzeczy, z których można być dumnym.'],
            ].map(([number, title, description]) => (
              <article key={number} className="border-b border-[#181817] py-7 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0">
                <span className="font-sans text-xs font-bold text-[#e85d3f]">{number}</span>
                <h3 className="mt-12 font-serif text-3xl font-bold tracking-[-0.03em]">{title}</h3>
                <p className="mt-4 font-sans text-sm leading-6 text-[#514f49]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer id="kontakt" className="flex flex-col justify-between gap-8 border-t border-[#181817] py-10 font-sans sm:flex-row sm:items-end">
          <div>
            <p className="font-serif text-3xl font-bold tracking-[-0.04em]">Porozmawiajmy.</p>
            <a href="mailto:hello@rafalwielgus.eu" className="mt-2 inline-block text-sm text-[#514f49] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#e85d3f]">hello@rafalwielgus.eu</a>
          </div>
          <p className="text-xs uppercase tracking-[0.15em] text-[#514f49]">© 2026 Rafał Wielgus</p>
        </footer>
      </div>
    </main>
  );
}
