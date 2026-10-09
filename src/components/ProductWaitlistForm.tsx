'use client';

import { useState } from 'react';

interface ProductWaitlistFormProps {
  ctaText?: string;
  isBottom?: boolean;
}

export default function ProductWaitlistForm({
  ctaText = 'Zapisz się na listę',
  isBottom = false,
}: ProductWaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  if (isBottom) {
    if (submitted) {
      return (
        <p className="font-sans text-sm font-bold text-[#e85d3f]">
          ✓ Dziękujemy! Twój e-mail ({email}) został dodany do listy oczekujących.
        </p>
      );
    }

    return (
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
          {ctaText} &rarr;
        </button>
      </form>
    );
  }

  if (submitted) {
    return (
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
    );
  }

  return (
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
        {ctaText} &rarr;
      </button>
      <p className="font-sans text-[11px] text-[#514f49]">
        Zero spamu. Tylko konkretne informacje o premierze i darmowe materiały.
      </p>
    </form>
  );
}
