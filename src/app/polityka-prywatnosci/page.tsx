import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Polityka Prywatności & RODO — Rafał Wielgus',
  description:
    'Zasady ochrony danych osobowych (RODO/UODO) oraz polityka plików cookies w serwisie rafalwielgus.eu.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Navbar />

        {/* Header */}
        <section className="border-b border-[#181817] py-14 sm:py-20">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#181817] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
                Dokument prawny
              </span>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">
                RODO &bull; UODO &bull; Prawo Telekomunikacyjne
              </span>
            </div>

            <h1 className="mt-6 font-serif text-[clamp(2.5rem,6vw,4.75rem)] font-black leading-[0.95] tracking-[-0.04em]">
              Polityka Prywatności & Cookies
            </h1>

            <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-[#514f49]">
              Szanuję Twoją prywatność, czas i przestrzeń cyfrową. Poniżej znajdziesz konkretne i przejrzyste informacje o tym, jak chronię Twoje dane, w jakim celu je przetwarzam oraz jakie prawa Ci przysługują.
            </p>

            <div className="mt-6 inline-block border border-[#181817] bg-[#ede7dc]/60 px-4 py-2 font-sans text-xs font-bold uppercase tracking-wider text-[#514f49]">
              Ostatnia aktualizacja: 17 września 2026 r.
            </div>
          </div>
        </section>

        {/* Content Body */}
        <article className="mx-auto max-w-4xl py-12 sm:py-16">
          <div className="space-y-12 font-sans text-base leading-8 text-[#33312e]">
            {/* 1. Administrator Danych */}
            <section className="border-b border-[#181817]/20 pb-10">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
                01 / Administrator
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#181817] sm:text-3xl">
                Kto jest administratorem Twoich danych?
              </h2>
              <p className="mt-4">
                Administratorem Twoich danych osobowych jest <strong>Rafał Wielgus</strong>, działający we Wrocławiu (Polska).
              </p>
              <p className="mt-2">
                We wszelkich sprawach dotyczących przetwarzania Twoich danych osobowych, realizacji praw RODO oraz plików cookies możesz skontaktować się bezpośrednio drogą elektroniczną pod adresem:{' '}
                <a
                  href="mailto:hello@rafalwielgus.eu"
                  className="font-bold text-[#181817] underline decoration-[#e85d3f] underline-offset-4 hover:text-[#e85d3f]"
                >
                  hello@rafalwielgus.eu
                </a>
                .
              </p>
            </section>

            {/* 2. Podstawy Prawne i Cele */}
            <section className="border-b border-[#181817]/20 pb-10">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
                02 / Cele i Podstawy
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#181817] sm:text-3xl">
                W jakim celu i na jakiej podstawie przetwarzam Twoje dane?
              </h2>
              <div className="mt-6 space-y-6">
                <div className="border border-[#181817] bg-white p-6 shadow-[4px_4px_0_#181817]">
                  <h3 className="font-serif text-lg font-bold text-[#181817]">
                    A. Subskrypcja autorskiego newslettera
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-[#514f49]">
                    <li><strong>Zakres danych:</strong> Twój adres e-mail.</li>
                    <li><strong>Cel:</strong> Przesyłanie cyklicznych esejów w rytmie wtorkowo-czwartkowym (godz. 09:00) oraz powiadomień o nowych materiałach edukacyjnych z zakresu technologii, AI i psychologii.</li>
                    <li><strong>Podstawa prawna:</strong> Dobrowolna zgoda wyrażona w modelu <em>Double Opt-In</em> (art. 6 ust. 1 lit. a RODO). Wymaga ona kliknięcia linku potwierdzającego wysłanego na Twój adres.</li>
                    <li><strong>Okres retencji:</strong> Do momentu wycofania zgody (wypisania się z newslettera).</li>
                  </ul>
                </div>

                <div className="border border-[#181817] bg-white p-6 shadow-[4px_4px_0_#181817]">
                  <h3 className="font-serif text-lg font-bold text-[#181817]">
                    B. Bezpośredni kontakt e-mailowy
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-[#514f49]">
                    <li><strong>Zakres danych:</strong> Adres e-mail, imię i nazwisko (jeśli podane) oraz treść korespondencji.</li>
                    <li><strong>Cel:</strong> Udzielenie odpowiedzi na Twoją wiadomość oraz prowadzenie bieżącej korespondencji.</li>
                    <li><strong>Podstawa prawna:</strong> Prawnie uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO) polegający na komunikacji z czytelnikami i partnerami.</li>
                    <li><strong>Okres retencji:</strong> Przez okres niezbędny do zakończenia korespondencji oraz ewentualnego przedawnienia roszczeń.</li>
                  </ul>
                </div>

                <div className="border border-[#181817] bg-white p-6 shadow-[4px_4px_0_#181817]">
                  <h3 className="font-serif text-lg font-bold text-[#181817]">
                    C. Bezpieczeństwo i diagnostyka serwera (Logi techniczne)
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm text-[#514f49]">
                    <li><strong>Zakres danych:</strong> Publiczny adres IP, data i godzina zapytania, identyfikator przeglądarki (User-Agent).</li>
                    <li><strong>Cel:</strong> Zapewnienie bezpieczeństwa teleinformatycznego, zapobieganie atakom DDoS/brute-force oraz diagnostyka stabilności aplikacji.</li>
                    <li><strong>Podstawa prawna:</strong> Prawnie uzasadniony interes administratora (art. 6 ust. 1 lit. f RODO).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Prawa Użytkownika */}
            <section className="border-b border-[#181817]/20 pb-10">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
                03 / Twoje Prawa
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#181817] sm:text-3xl">
                Jakie prawa przysługują Ci na mocy RODO?
              </h2>
              <p className="mt-4">
                Rozporządzenie o Ochronie Danych Osobowych (RODO) gwarantuje Ci szereg praw, które możesz zrealizować w każdej chwili:
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ['Prawo do dostępu do danych', 'Możesz zażądać potwierdzenia, czy Twoje dane są przetwarzane oraz uzyskać ich kopię (art. 15 RODO).'],
                  ['Prawo do sprostowania', 'Możesz poprawić swoje dane, jeśli są niekompletne lub nieaktualne (art. 16 RODO).'],
                  ['Prawo do usunięcia danych', '„Prawo do bycia zapomnianym” (art. 17 RODO). W przypadku newslettera wypiszesz się natychmiast 1 kliknięciem.'],
                  ['Prawo do ograniczenia przetwarzania', 'Możesz żądać ograniczenia przetwarzania danych w określonych sytuacjach (art. 18 RODO).'],
                  ['Prawo do sprzeciwu', 'Masz prawo wnieść sprzeciw wobec przetwarzania opartego na prawnie uzasadnionym interesie (art. 21 RODO).'],
                  ['Prawo do cofnięcia zgody', 'Możesz cofnąć zgodę na newsletter w dowolnym momencie, bez wpływu na wcześniejszą legalność wysyłki.'],
                ].map(([title, desc]) => (
                  <div key={title} className="border border-[#181817]/30 bg-[#ede7dc]/40 p-5">
                    <h4 className="font-serif text-base font-bold text-[#181817]">{title}</h4>
                    <p className="mt-2 text-xs leading-relaxed text-[#514f49]">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-l-4 border-[#e85d3f] bg-white p-5 shadow-[2px_2px_0_#181817]">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-[#181817]">
                  Prawo wniesienia skargi do organu nadzorczego (UODO):
                </h4>
                <p className="mt-2 text-sm text-[#514f49]">
                  Jeśli uznasz, że przetwarzanie Twoich danych narusza przepisy prawa, przysługuje Ci prawo do wniesienia skargi do właściwego organu nadzorczego: <strong>Prezes Urzędu Ochrony Danych Osobowych (UODO)</strong>, ul. Stawki 2, 00-193 Warszawa.
                </p>
              </div>
            </section>

            {/* 4. Polityka Cookies */}
            <section className="border-b border-[#181817]/20 pb-10">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
                04 / Ciasteczka
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#181817] sm:text-3xl">
                Polityka plików cookies i pamięci przeglądarki
              </h2>
              <p className="mt-4">
                Serwis <strong>rafalwielgus.eu</strong> korzysta wyłącznie z niezbędnych plików cookies i pamięci lokalnej (<em>localStorage</em>), wymaganych do prawidłowego i bezpiecznego funkcjonowania witryny:
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse border border-[#181817] bg-white text-left text-sm">
                  <thead>
                    <tr className="bg-[#181817] text-white">
                      <th className="border border-[#181817] p-3 font-sans text-xs uppercase">Klucz / Nazwa</th>
                      <th className="border border-[#181817] p-3 font-sans text-xs uppercase">Typ & Ważność</th>
                      <th className="border border-[#181817] p-3 font-sans text-xs uppercase">Cel przetwarzania</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-[#181817] p-3 font-mono text-xs">rw_cookie_consent</td>
                      <td className="border border-[#181817] p-3 text-xs">Pamięć trwała (localStorage)</td>
                      <td className="border border-[#181817] p-3 text-xs text-[#514f49]">Zapamiętanie Twojego wyboru w banerze zgody na ciasteczka.</td>
                    </tr>
                    <tr className="bg-[#ede7dc]/30">
                      <td className="border border-[#181817] p-3 font-mono text-xs">token (sesyjny)</td>
                      <td className="border border-[#181817] p-3 text-xs">Cookie sesyjne (HttpOnly)</td>
                      <td className="border border-[#181817] p-3 text-xs text-[#514f49]">Wyłącznie dla autoryzacji panelu administratora serwisu.</td>
                    </tr>
                    <tr>
                      <td className="border border-[#181817] p-3 font-mono text-xs">_ga, _ga_*</td>
                      <td className="border border-[#181817] p-3 text-xs">Ciasteczka analityczne (Google)</td>
                      <td className="border border-[#181817] p-3 text-xs text-[#514f49]">
                        Statystyki odwiedzin (Google Analytics 4). <strong>Uruchamiane wyłącznie po kliknięciu „Akceptuję”</strong> w banerze cookies (Google Consent Mode v2) z pełną anonimizacją IP.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 border border-[#181817] bg-[#ede7dc]/40 p-6">
                <h4 className="font-serif text-lg font-bold text-[#181817]">
                  Brak inwazyjnego śledzenia reklamowego
                </h4>
                <p className="mt-2 text-sm text-[#514f49]">
                  Ten blog <strong>nie instaluje</strong> pikseli remarketingowych korporacji reklamowych (np. Meta Pixel, TikTok, reklamowe sieci śledzące). Dane z Google Analytics służą wyłącznie do zrozumienia, które eseje cieszą się największym zainteresowaniem czytelników i nie są łączone z profilami reklamowymi.
                </p>
              </div>
            </section>

            {/* 5. Podmioty Przetwarzające */}
            <section className="border-b border-[#181817]/20 pb-10">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
                05 / Partnerzy Technologiczni
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#181817] sm:text-3xl">
                Kto pomaga mi w obsłudze serwisu (Procesorzy)?
              </h2>
              <p className="mt-4">
                Aby zapewnić niezawodność, bezpieczeństwo, doręczalność wiadomości oraz anonimowe statystyki, korzystam z wyspecjalizowanych dostawców infrastruktury IT:
              </p>
              <ul className="mt-4 list-disc space-y-3 pl-6 text-sm text-[#514f49]">
                <li>
                  <strong>Google Ireland Limited</strong> (Gordon House, Barrow Street, Dublin 4, Irlandia) — dostawca narzędzia analitycznego Google Analytics 4. Dane przetwarzane są z włączoną anonimizacją adresów IP oraz standardem Google Consent Mode v2 (aktywny wyłącznie za Twoją zgodą).
                </li>
                <li>
                  <strong>Resend Inc.</strong> (USA) — infrastruktura techniczna do wysyłki e-maili transakcyjnych i newslettera. Przetwarzanie odbywa się w oparciu o Standardowe Klauzule Umowne (Standard Contractual Clauses – SCC) zatwierdzone przez Komisję Europejską.
                </li>
                <li>
                  <strong>Dostawca usług hostingowych</strong> — serwery utrzymujące aplikację Next.js oraz bazę danych z zachowaniem rygorystycznych standardów bezpieczeństwa.
                </li>
              </ul>
            </section>

            {/* 6. Kontakt */}
            <section className="pb-8">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
                06 / Pytania
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#181817] sm:text-3xl">
                Masz pytania dotyczące Twojej prywatności?
              </h2>
              <p className="mt-4">
                Jeśli masz jakiekolwiek wątpliwości lub chcesz skorzystać ze swoich praw, napisz do mnie śmiało:
              </p>
              <div className="mt-6">
                <a
                  href="mailto:hello@rafalwielgus.eu"
                  className="inline-block bg-[#181817] px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e85d3f]"
                >
                  Napisz: hello@rafalwielgus.eu &rarr;
                </a>
              </div>
            </section>
          </div>
        </article>

        {/* Reusable Footer */}
        <Footer />
      </div>
    </main>
  );
}
