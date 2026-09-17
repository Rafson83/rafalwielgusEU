import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'O mnie — Rafał Wielgus',
  description: 'Historia o elektronice, przedsiębiorczości, spektakularnym bankructwie, psychologii, automatyce przemysłowej i filozofii Long-Life Learning.',
};

export default function AboutPage() {
  const timeline = [
    {
      number: '01',
      period: 'Początki & Edukacja',
      title: 'Iskra techniczna i droga samouka',
      badge: 'Fundament',
      description:
        'Od czasów szkoły podstawowej fascynowały mnie komputery, kod i to, jak martwe podzespoły ożywają pod wpływem logicznych instrukcji. Z wykształcenia jestem technikiem elektronikiem. Choć formalna ścieżka akademicka nie zaprowadziła mnie na studia informatyczne, nigdy nie przestałem być w samym centrum technologicznych nowinek. Droga samouka nauczyła mnie najważniejszego: determinacji w szukaniu odpowiedzi i umiejętności rozkładania każdego problemu na części pierwsze.',
    },
    {
      number: '02',
      period: 'Przedsiębiorczość',
      title: 'Serwis AGD i spektakularna lekcja pokory',
      badge: 'Lekcja życia',
      description:
        'Zawsze ciągnęło mnie do niezależności. Chciałem budować na własny rachunek, dlatego wszedłem w świat biznesu i stworzyłem serwis AGD. Firma funkcjonowała przez kilka lat, dając mi przedsmak wolności, ale też bezlitosną szkołę rynkową. Ostatecznie projekt zakończył się spektakularnym bankructwem. To nie była porażka z podręczników – to był realny cios, który nauczył mnie więcej o finansach, ryzyku, psychice i odpowiedzialności niż jakiekolwiek studia MBA.',
    },
    {
      number: '03',
      period: 'Doświadczenie korporacyjne',
      title: 'Kontrola jakości i zwinne procesy',
      badge: 'Procesy & Jakość',
      description:
        'Po upadku firmy potrzebowałem stabilizacji i nowego spojrzenia. Trafiłem do korporacji, gdzie objąłem stanowisko w dziale kontroli jakości. To był zwrotny punkt: z chaosu małego biznesu przeszedłem w świat rygorystycznych procedur, standardów i powtarzalności. Tam poznałem metodyki zwinnego zarządzania (Agile), optymalizację Lean i zrozumiałem, że intuicja to za mało — fundamentem stabilnego wzrostu jest myślenie procesowe.',
    },
    {
      number: '04',
      period: 'Poszukiwanie równowagi',
      title: 'Studia psychologiczne i odkrycie empatii',
      badge: 'Człowiek',
      description:
        'Sama technika i procedury to tylko połowa równania. W pewnym momencie poczułem, że muszę lepiej zrozumieć najważniejszy czynnik każdego systemu — człowieka. Podjąłem studia psychologiczne. Choć był to stosunkowo krótki epizod, trwale zmienił moje spojrzenie na świat. Pozwolił mi odkryć i rozwinąć wrażliwszą, empatyczną stronę mojej osobowości. Przestałem patrzeć na problemy wyłącznie jak technik od obwodów; zacząłem dostrzegać emocje, motywacje i potrzeby ludzi.',
    },
    {
      number: '05',
      period: 'Teraźniejszość',
      title: 'Utrzymanie ruchu, recykling i sztuczna inteligencja',
      badge: 'Tu i teraz',
      description:
        'Dziś łączę wszystkie dotychczasowe kropki, pracując w dziale utrzymania ruchu w firmie z branży recyklingu. Zmieniam świat od najbardziej namacalnej strony — dbając o ciągłość procesów, które dają surowcom drugie życie. Na co dzień zgłębiam automatykę przemysłową oraz praktyczne zastosowania sztucznej inteligencji. Technologia interesuje mnie najbardziej wtedy, gdy rozwiązuje realne, fizyczne wyzwania.',
    },
    {
      number: '06',
      period: 'Misja i Przyszłość',
      title: 'Long-Life Learning & produkty cyfrowe',
      badge: 'Wizja',
      description:
        'Żyjemy w świecie, który wymaga ciągłej redefinicji siebie. Moim celem jest tworzenie treści oraz produktów cyfrowych wspierających filozofię Long-Life Learning (nauki przez całe życie) oraz interdyscyplinarny rozwój człowieka. Chcę budować przestrzeń dla tych, którzy nie chcą dać się zamknąć w jednej ciasnej specjalizacji i mają odwagę łączyć technikę z humanistycznym spojrzeniem.',
    },
  ];

  const values = [
    {
      num: 'I',
      title: 'Interdyscyplinarność',
      desc: 'Najciekawsze idee rodzą się na styku dziedzin. Połączenie elektroniki, psychologii, optymalizacji procesów i AI daje perspektywę, której nie da się zdobyć z jednej książki.',
    },
    {
      num: 'II',
      title: 'Prawda z pierwszej linii frontu',
      desc: 'Szanuję błędy i blizny po porażkach. Teoria bez praktyki to tylko szum. Prawdziwa wiedza pochodzi z naprawiania maszyn, gaszenia pożarów i podnoszenia się po bankructwie.',
    },
    {
      num: 'III',
      title: 'Empatyczny pragmatyzm',
      desc: 'Technologia ma służyć człowiekowi, a nie odwrotnie. Najbardziej zaawansowany kod i zautomatyzowane linie produkcyjne muszą odpowiadać na realne potrzeby ludzkie.',
    },
    {
      num: 'IV',
      title: 'Long-Life Learning',
      desc: 'Nauka nie kończy się z dyplomem. Codzienna ciekawość, eksperymenty i gotowość do bycia początkującym to jedyna skuteczna strategia w dynamicznym świecie.',
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Navbar />

        {/* Hero Section */}
        <section className="border-b border-[#181817] py-16 sm:py-24">
          <div className="max-w-4xl">
            <p className="mb-6 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#e85d3f]">
              Rafał Wielgus &bull; Historia &bull; Filozofia
            </p>
            <h1 className="font-serif text-[clamp(2.75rem,7vw,6.5rem)] font-black leading-[0.9] tracking-[-0.05em]">
              Od układów scalonych i bankructwa po AI i psychologię.
            </h1>
            <p className="mt-10 max-w-2xl font-sans text-lg leading-8 text-[#514f49] sm:text-xl">
              Nigdy nie wierzyłem, że człowiek musi zamknąć się w jednej szufladzie. Moja droga to suma twardych technicznych lekcji, warsztatowej praktyki, biznesowych potknięć, korporacyjnego rygoru i humanistycznej ciekawości drugiego człowieka.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[#181817] pt-8 sm:grid-cols-4">
            <div>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">Fundament</span>
              <p className="mt-1 font-serif text-2xl font-bold">Elektronik & IT</p>
            </div>
            <div>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">Doświadczenie</span>
              <p className="mt-1 font-serif text-2xl font-bold">Biznes & Agile</p>
            </div>
            <div>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">Teraźniejszość</span>
              <p className="mt-1 font-serif text-2xl font-bold">Recykling & AI</p>
            </div>
            <div>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">Misja</span>
              <p className="mt-1 font-serif text-2xl font-bold">Long-Life Learning</p>
            </div>
          </div>
        </section>

        {/* Narrative Intro & Quote */}
        <section className="grid gap-12 border-b border-[#181817] py-16 sm:py-20 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">
              Manifest osobisty
            </span>
            <blockquote className="mt-6 border-l-4 border-[#e85d3f] pl-6 font-serif text-2xl font-bold italic leading-snug text-[#181817] sm:text-3xl">
              „Porażki uczą pokory. Korporacja uczy procesów. Psychologia uczy empatii. A pasja techniczna daje narzędzia, by to wszystko złożyć w całość.”
            </blockquote>
          </div>
          <div className="space-y-6 font-sans text-base leading-8 text-[#514f49] sm:text-lg">
            <p>
              Często słyszy się radę: <em>„Wybierz jedną wąską specjalizację i trzymaj się jej do emerytury”</em>. Dla mnie taka wizja zawsze była zbyt ciasna. Od małego rozkręcałem urządzenia, pisałem pierwsze skrypty i zadawałem niewygodne pytania o to, jak rzeczy działają pod maską.
            </p>
            <p>
              Kiedy po latach zderzyłem się z brutalną rzeczywistością bankructwa własnego biznesu, nie uciekłem od technologii. Zamiast tego poszedłem do korporacji, by nauczyć się porządku, a potem na studia psychologiczne, by nie zatracić wrażliwości na człowieka. Dziś wiem, że te z pozoru rozbieżne doświadczenia tworzą spójną całość.
            </p>
          </div>
        </section>

        {/* The Timeline / Chapters */}
        <section className="border-b border-[#181817] py-16 sm:py-24">
          <div className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">Kamienie milowe</p>
              <h2 className="mt-3 font-serif text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                Rozdziały mojej drogi
              </h2>
            </div>
            <p className="max-w-md font-sans text-sm text-[#514f49]">
              Sześć kluczowych etapów, które ukształtowały mój sposób myślenia o technologii, pracy i ludziach.
            </p>
          </div>

          <div className="space-y-12">
            {timeline.map((step) => (
              <div
                key={step.number}
                className="group relative grid gap-6 border-t border-[#181817]/30 pt-8 transition-colors hover:border-[#e85d3f] lg:grid-cols-[160px_1fr_2fr] lg:gap-12"
              >
                {/* Number & Badge */}
                <div className="flex items-baseline justify-between lg:flex-col lg:justify-start">
                  <span className="font-serif text-4xl font-bold text-[#e85d3f] group-hover:scale-105 transition-transform">
                    {step.number}
                  </span>
                  <span className="mt-2 inline-block font-sans text-[11px] font-bold uppercase tracking-wider text-[#514f49]">
                    {step.period}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <span className="inline-block bg-[#181817] px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white mb-3">
                    {step.badge}
                  </span>
                  <h3 className="font-serif text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-3xl">
                    {step.title}
                  </h3>
                </div>

                {/* Description */}
                <div>
                  <p className="font-sans text-base leading-7 text-[#514f49]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy / Values */}
        <section className="border-b border-[#181817] py-16 sm:py-24">
          <div className="mb-12">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#e85d3f]">Filary</p>
            <h2 className="mt-3 font-serif text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Czym kieruję się w pracy i życiu
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((val) => (
              <div
                key={val.num}
                className="border border-[#181817] bg-[#ede7dc]/40 p-6 transition-all hover:-translate-y-1 hover:border-[#e85d3f] hover:shadow-[6px_6px_0_#181817]"
              >
                <span className="font-serif text-3xl font-black text-[#e85d3f]">{val.num}</span>
                <h3 className="mt-4 font-serif text-xl font-bold tracking-tight">{val.title}</h3>
                <p className="mt-3 font-sans text-sm leading-6 text-[#514f49]">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="grid items-center gap-8 py-16 sm:py-24 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="font-serif text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
              Budujesz coś ciekawego? Porozmawiajmy.
            </h2>
            <p className="mt-6 max-w-xl font-sans text-base leading-7 text-[#514f49] sm:text-lg">
              Chętnie wymienię się myślami o automatyce, AI, zrównoważonym rozwoju, tworzeniu produktów cyfrowych lub metodykach pracy.
            </p>
            <div className="mt-8 flex flex-wrap gap-5 font-sans text-sm font-bold">
              <a
                href="mailto:hello@rafalwielgus.eu"
                className="bg-[#181817] px-7 py-4 text-white transition-transform hover:-translate-y-1"
              >
                Napisz do mnie <span className="ml-3 text-[#e85d3f]">&rarr;</span>
              </a>
              <Link
                href="/blog"
                className="border border-[#181817] px-7 py-4 transition-colors hover:border-[#e85d3f] hover:text-[#e85d3f]"
              >
                Przeczytaj moje artykuły
              </Link>
            </div>
          </div>

          <div className="border border-[#181817] bg-[#ede7dc] p-8">
            <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">W pigułce</span>
            <ul className="mt-4 space-y-3 font-sans text-sm text-[#181817]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-[#e85d3f]"></span>
                <strong>Lokalizacja:</strong> Polska
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-[#e85d3f]"></span>
                <strong>Rola:</strong> Dział Utrzymania Ruchu & Twórca cyfrowy
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-[#e85d3f]"></span>
                <strong>Obszary:</strong> Recykling, Automatyka, AI, Zwinne procesy
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-[#e85d3f]"></span>
                <strong>Filozofia:</strong> Long-Life Learning
              </li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
