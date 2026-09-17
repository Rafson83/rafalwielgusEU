'use client';

import React from 'react';

interface MarkdownViewProps {
  content: string;
  theme?: 'light' | 'dark';
  enableDropCap?: boolean;
}

// Pomocnik do formatowania tekstu wewnątrz linii (bold, italic, inline code, linki)
function renderInlineMarkdown(text: string, theme: 'light' | 'dark'): React.ReactNode[] {
  // Rozbicie po regexie na tokeny: linki [text](url), bold **text**, italic *text*, inline code `code`
  const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    // Link: [tytuł](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, linkText, url] = linkMatch;
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            theme === 'dark'
              ? 'text-indigo-400 underline hover:text-indigo-300 transition-colors'
              : 'text-[#e85d3f] underline hover:text-[#181817] transition-colors font-semibold'
          }
        >
          {linkText}
        </a>
      );
    }

    // Bold: **tekst**
    const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
    if (boldMatch) {
      return (
        <strong
          key={i}
          className={theme === 'dark' ? 'font-bold text-white' : 'font-bold text-[#181817]'}
        >
          {boldMatch[1]}
        </strong>
      );
    }

    // Italic: *tekst*
    const italicMatch = part.match(/^\*(.*?)\*$/);
    if (italicMatch) {
      return (
        <em key={i} className="italic">
          {italicMatch[1]}
        </em>
      );
    }

    // Inline code: `kod`
    const codeMatch = part.match(/^`(.*?)`$/);
    if (codeMatch) {
      return (
        <code
          key={i}
          className={
            theme === 'dark'
              ? 'px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 font-mono text-[0.88em]'
              : 'px-1.5 py-0.5 rounded bg-[#e8e2d5] text-[#181817] font-mono text-[0.88em]'
          }
        >
          {codeMatch[1]}
        </code>
      );
    }

    return part;
  });
}

export default function MarkdownView({
  content,
  theme = 'light',
  enableDropCap = false,
}: MarkdownViewProps) {
  if (!content) return null;

  // Podział treści na bloki (akapity, nagłówki, bloki kodu, listy, cytaty)
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];

  let i = 0;
  let paragraphIndex = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 1. Pusta linia
    if (line.trim() === '') {
      i++;
      continue;
    }

    // 2. Pozioma linia: --- lub ***
    if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
      blocks.push(
        <hr
          key={`hr-${i}`}
          className={
            theme === 'dark'
              ? 'my-8 border-t border-white/10'
              : 'my-8 border-t border-[#181817]/20'
          }
        />
      );
      i++;
      continue;
    }

    // 3. Blok kodu (```language ... ```)
    if (line.trim().startsWith('```')) {
      const language = line.trim().replace(/^```/, '').trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // pomiń zamykający ```

      blocks.push(
        <div
          key={`code-${i}`}
          className="my-6 rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] text-gray-200 shadow-xl"
        >
          {language && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-black/40 text-[11px] font-mono text-gray-400">
              <span className="uppercase tracking-wider">{language}</span>
              <span>Kod</span>
            </div>
          )}
          <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    // 4. Nagłówki: # , ## , ###
    const h1Match = line.match(/^#\s+(.*)$/);
    if (h1Match) {
      blocks.push(
        <h1
          key={`h1-${i}`}
          className={
            theme === 'dark'
              ? 'text-2xl sm:text-3xl font-extrabold text-white mt-8 mb-4'
              : 'text-2xl sm:text-4xl font-serif font-black text-[#181817] mt-10 mb-4'
          }
        >
          {renderInlineMarkdown(h1Match[1], theme)}
        </h1>
      );
      i++;
      continue;
    }

    const h2Match = line.match(/^##\s+(.*)$/);
    if (h2Match) {
      blocks.push(
        <h2
          key={`h2-${i}`}
          className={
            theme === 'dark'
              ? 'text-xl sm:text-2xl font-bold text-indigo-300 mt-8 mb-3'
              : 'text-xl sm:text-2xl font-serif font-bold text-[#181817] mt-8 mb-3 border-b border-[#181817]/10 pb-2'
          }
        >
          {renderInlineMarkdown(h2Match[1], theme)}
        </h2>
      );
      i++;
      continue;
    }

    const h3Match = line.match(/^###\s+(.*)$/);
    if (h3Match) {
      blocks.push(
        <h3
          key={`h3-${i}`}
          className={
            theme === 'dark'
              ? 'text-lg sm:text-xl font-bold text-gray-200 mt-6 mb-2'
              : 'text-lg sm:text-xl font-serif font-bold text-[#3d3b37] mt-6 mb-2'
          }
        >
          {renderInlineMarkdown(h3Match[1], theme)}
        </h3>
      );
      i++;
      continue;
    }

    // 5. Cytat / Callout (> ...)
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }

      const quoteText = quoteLines.join(' ');
      const isCallout = quoteText.includes('💡') || quoteText.toLowerCase().includes('lekcja');
      const isWarning = quoteText.includes('⚠️') || quoteText.toLowerCase().includes('uwaga');

      blocks.push(
        <blockquote
          key={`quote-${i}`}
          className={`my-6 p-4 sm:p-5 rounded-xl border ${
            isCallout
              ? theme === 'dark'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-[#fff9e6] border-[#f59e0b]/40 text-[#78350f]'
              : isWarning
              ? theme === 'dark'
                ? 'bg-red-500/10 border-red-500/30 text-red-200'
                : 'bg-[#fee2e2] border-[#ef4444]/40 text-[#991b1b]'
              : theme === 'dark'
              ? 'bg-white/[0.03] border-l-4 border-indigo-500 text-gray-300 italic'
              : 'bg-[#ede7dc]/40 border-l-4 border-[#181817] text-[#514f49] italic'
          }`}
        >
          <div className="text-base sm:text-lg leading-relaxed">
            {renderInlineMarkdown(quoteText, theme)}
          </div>
        </blockquote>
      );
      continue;
    }

    // 6. Lista punktowana (- lub *)
    if (/^[\*\-]\s+/.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^[\*\-]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[\*\-]\s+/, ''));
        i++;
      }

      blocks.push(
        <ul
          key={`ul-${i}`}
          className={`my-5 space-y-2 pl-6 list-disc ${
            theme === 'dark' ? 'text-gray-300' : 'text-[#3d3b37]'
          }`}
        >
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineMarkdown(item, theme)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 7. Lista numerowana (1. 2. 3.)
    if (/^\d+\.\s+/.test(line.trim())) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }

      blocks.push(
        <ol
          key={`ol-${i}`}
          className={`my-5 space-y-2 pl-6 list-decimal ${
            theme === 'dark' ? 'text-gray-300' : 'text-[#3d3b37]'
          }`}
        >
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineMarkdown(item, theme)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // 8. Tabela Markdown (| kolumna | kolumna |)
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerCells = tableLines[0]
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        const dataRows = tableLines.slice(2).map((r) =>
          r
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim())
        );

        blocks.push(
          <div key={`table-${i}`} className="my-6 overflow-x-auto">
            <table
              className={`w-full text-left text-sm border-collapse rounded-xl overflow-hidden ${
                theme === 'dark' ? 'border border-white/10' : 'border border-[#181817]/20'
              }`}
            >
              <thead className={theme === 'dark' ? 'bg-white/5 text-white' : 'bg-[#ede7dc] text-[#181817]'}>
                <tr>
                  {headerCells.map((cell, idx) => (
                    <th key={idx} className="p-3 border-b font-semibold border-inherit">
                      {renderInlineMarkdown(cell, theme)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={theme === 'dark' ? 'divide-y divide-white/5' : 'divide-y divide-[#181817]/10'}>
                {dataRows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={
                      theme === 'dark'
                        ? 'hover:bg-white/[0.02]'
                        : 'hover:bg-[#ede7dc]/30'
                    }
                  >
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} className="p-3">
                        {renderInlineMarkdown(cell, theme)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 9. Akapit tekstu zwykłego
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !/^[\*\-]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !(lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) &&
      !/^(\s*[-*_]\s*){3,}$/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }

    const paraText = paraLines.join('\n');
    const isFirstParagraph = paragraphIndex === 0;
    paragraphIndex++;

    blocks.push(
      <p
        key={`p-${i}`}
        className={`mb-6 leading-[1.85] ${
          isFirstParagraph && enableDropCap && theme === 'light'
            ? 'first-letter:float-left first-letter:mr-4 first-letter:font-serif first-letter:text-6xl first-letter:font-black first-letter:leading-[0.8] first-letter:text-[#181817]'
            : ''
        } ${theme === 'dark' ? 'text-gray-300' : 'text-[#181817]'}`}
      >
        {renderInlineMarkdown(paraText, theme)}
      </p>
    );
  }

  return <div className="markdown-content">{blocks}</div>;
}
