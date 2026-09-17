'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const isSuccess = status === 'success';
  const isUnsubscribed = status === 'unsubscribed';
  const isMissing = status === 'missing_token' || status === 'invalid';

  return (
    <div className="mx-auto my-10 max-w-3xl border border-[#181817] bg-[#ede7dc]/60 p-5 sm:p-14 shadow-[5px_5px_0_#181817] sm:shadow-[10px_10px_0_#181817]">
      {isSuccess && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#181817] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
              Subskrypcja potwierdzona
            </span>
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#e85d3f]">
              Wtorki & Czwartki &bull; 09:00
            </span>
          </div>

          <h1 className="mt-6 font-serif text-[clamp(2.2rem,5vw,3.5rem)] font-black leading-[1.02] tracking-[-0.04em] text-[#181817]">
            Witaj w gronie czytelników.
          </h1>

          <p className="mt-6 font-sans text-lg leading-relaxed text-[#514f49]">
            Twój adres e-mail został pomyślnie zweryfikowany. W każdy <strong>wtorek i czwartek o 09:00</strong> otrzymasz ode mnie konkretny, autorski esej o technologii, automatyzacji, psychologii oraz idei Long-Life Learning.
          </p>

          <div className="mt-8 border-t border-[#181817]/20 pt-8">
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-[#e85d3f]">
              Co teraz?
            </p>
            <p className="mt-2 font-sans text-sm text-[#514f49]">
              Nie musisz czekać do wtorku — możesz zacząć od przeczytania aktualnie opublikowanych esejów na blogu:
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="bg-[#181817] px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e85d3f]"
              >
                Przejdź do czytania bloga &rarr;
              </Link>
              <Link
                href="/o-mnie"
                className="border border-[#181817] bg-white px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-[#181817] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#181817]"
              >
                Poznaj moją historię
              </Link>
            </div>
          </div>
        </>
      )}

      {isUnsubscribed && (
        <>
          <span className="bg-[#181817] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
            Wypisano z listy
          </span>

          <h1 className="mt-6 font-serif text-[clamp(2.2rem,5vw,3.5rem)] font-black leading-[1.02] tracking-[-0.04em] text-[#181817]">
            Zostałeś pomyślnie wypisany.
          </h1>

          <p className="mt-6 font-sans text-lg leading-relaxed text-[#514f49]">
            Twój adres został usunięty z listy mailingowej. Nie będziesz już otrzymywać powiadomień o nowych esejach. Jeśli to była pomyłka, w każdej chwili możesz zapisać się ponownie na blogu.
          </p>

          <div className="mt-8 border-t border-[#181817]/20 pt-8">
            <Link
              href="/blog"
              className="bg-[#181817] px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e85d3f]"
            >
              &larr; Wróć do bloga
            </Link>
          </div>
        </>
      )}

      {isMissing && (
        <>
          <span className="bg-[#e85d3f] px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider text-white">
            Nieprawidłowy link
          </span>

          <h1 className="mt-6 font-serif text-[clamp(2.2rem,5vw,3.5rem)] font-black leading-[1.02] tracking-[-0.04em] text-[#181817]">
            Link aktywacyjny wygasł lub jest błędny.
          </h1>

          <p className="mt-6 font-sans text-lg leading-relaxed text-[#514f49]">
            Wygląda na to, że link z wiadomości e-mail został już wykorzystany lub jest niekompletny. Spróbuj podać swój adres e-mail ponownie na stronie głównej bloga.
          </p>

          <div className="mt-8 border-t border-[#181817]/20 pt-8">
            <Link
              href="/blog"
              className="bg-[#181817] px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#e85d3f]"
            >
              &larr; Wróć do formularza na blogu
            </Link>
          </div>
        </>
      )}

      {!isSuccess && !isUnsubscribed && !isMissing && (
        <>
          <h1 className="font-serif text-3xl font-black text-[#181817]">
            Status subskrypcji newslettera
          </h1>
          <p className="mt-4 font-sans text-base text-[#514f49]">
            Przejdź na stronę bloga, aby zarządzać swoimi powiadomieniami.
          </p>
          <div className="mt-8">
            <Link
              href="/blog"
              className="bg-[#181817] px-6 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-white"
            >
              &larr; Wróć do bloga
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-[#f4f0e9] text-[#181817] selection:bg-[#e85d3f] selection:text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Navbar />
        <Suspense
          fallback={
            <div className="mx-auto my-24 max-w-xl text-center font-sans text-sm font-bold uppercase tracking-widest text-[#514f49]">
              Weryfikacja statusu...
            </div>
          }
        >
          <ConfirmationContent />
        </Suspense>
        <Footer />
      </div>
    </main>
  );
}
