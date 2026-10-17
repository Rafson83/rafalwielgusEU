'use client';

import React, { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  slug: string;
  category?: string;
  className?: string;
}

export default function ShareButtons({
  title,
  slug,
  category,
  className = '',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const articleUrl = `https://rafalwielgus.eu/blog/${slug}`;

  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(`${title} — Rafał Wielgus`);

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(articleUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className={`border border-[#181817] bg-[#ede7dc]/40 p-5 sm:p-6 shadow-[4px_4px_0_#181817] ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#e85d3f]">
            Wartościowa treść?
          </span>
          <p className="font-serif text-lg font-bold text-[#181817]">
            Podziel się tym esejem w sieci
          </p>
          <p className="mt-0.5 font-sans text-xs text-[#514f49]">
            Pomóż szerzyć rzetelne rzemiosło, kulturę jakości i myślenie inżynierskie.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* LinkedIn */}
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-[#181817] bg-[#181817] px-3.5 py-2 font-sans text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#0077b5] hover:shadow-[3px_3px_0_#181817]"
            title="Udostępnij na LinkedIn"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.8v8.37h-2.8v-8.37M7.86 6.3a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
            </svg>
            <span>LinkedIn</span>
          </a>

          {/* X (Twitter) */}
          <a
            href={shareLinks.x}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-[#181817] bg-[#181817] px-3.5 py-2 font-sans text-xs font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#000000] hover:shadow-[3px_3px_0_#181817]"
            title="Udostępnij na X"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>X (Twitter)</span>
          </a>

          {/* Facebook */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-[#181817] bg-transparent px-3.5 py-2 font-sans text-xs font-bold text-[#181817] transition-all hover:-translate-y-0.5 hover:border-[#1877f2] hover:text-[#1877f2] hover:shadow-[3px_3px_0_#181817]"
            title="Udostępnij na Facebooku"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
            </svg>
            <span>Facebook</span>
          </a>

          {/* Kopiuj link */}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 border px-3.5 py-2 font-sans text-xs font-bold transition-all hover:-translate-y-0.5 ${
              copied
                ? 'border-[#2e7d32] bg-[#2e7d32] text-white shadow-[3px_3px_0_#181817]'
                : 'border-[#181817] bg-white text-[#181817] hover:border-[#e85d3f] hover:text-[#e85d3f] hover:shadow-[3px_3px_0_#181817]'
            }`}
            title="Skopiuj bezpośredni odnośnik"
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Skopiowano!</span>
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                </svg>
                <span>Kopiuj link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
