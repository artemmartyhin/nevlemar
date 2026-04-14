'use client';

import { useState } from 'react';

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const btn = 'inline-flex items-center justify-center w-10 h-10 rounded-full border border-nv-dark/20 hover:bg-nv-cream/40 transition';

  return (
    <div className="flex items-center gap-2">
      <button onClick={copy} className={btn} aria-label="Copy link">
        {copied ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00172d" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Facebook">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#00172d"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>
      </a>
      <a href={`https://t.me/share/url?url=${encoded}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Telegram">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#00172d"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className={btn} aria-label="Twitter">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#00172d"><path d="M18.244 2H21.5l-7.5 8.58L22.75 22h-6.93l-5.42-7.12L4.2 22H.94l8-9.15L.5 2h7.09l4.9 6.48L18.24 2zm-2.43 18h1.9L7.27 4H5.27l10.54 16z"/></svg>
      </a>
    </div>
  );
}
