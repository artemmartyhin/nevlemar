'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { useState, useRef, useEffect } from 'react';
import { locales, type Locale } from '@/i18n';

const names: Record<Locale, { code: string; name: string }> = {
  uk: { code: 'UA', name: 'Українська' },
  en: { code: 'EN', name: 'English' },
  de: { code: 'DE', name: 'Deutsch' },
  it: { code: 'IT', name: 'Italiano' },
  pl: { code: 'PL', name: 'Polski' },
  fr: { code: 'FR', name: 'Français' },
  es: { code: 'ES', name: 'Español' },
  cs: { code: 'CS', name: 'Čeština' },
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const change = (loc: Locale) => {
    setOpen(false);
    router.replace(pathname, { locale: loc });
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-nv-dark/20 px-3 py-2 text-nv-dark font-semibold hover:bg-nv-cream/30 transition"
        aria-label="Change language"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00172d" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20z" />
        </svg>
        <span className="font-display">{names[locale].code}</span>
        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 3 L5 7 L9 3" stroke="#00172d" strokeWidth="1.5" fill="none"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[180px] rounded-xl bg-white shadow-lg border border-nv-cream/60 py-2 z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => change(loc)}
              className={`w-full text-left px-4 py-2 font-display hover:bg-nv-cream/30 flex items-center justify-between ${
                loc === locale ? 'text-nv-dark font-bold' : 'text-nv-dark/80'
              }`}
            >
              <span>{names[loc].name}</span>
              <span className="text-xs opacity-60">{names[loc].code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
