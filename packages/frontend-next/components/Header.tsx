'use client';

import Image from 'next/image';
import { Link, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';

const links = [
  { href: '/', key: 'home' },
  { href: '/poms', key: 'pomeranian' },
  { href: '/cvergs', key: 'cvergsnaucer' },
  { href: '/puppies', key: 'puppies' },
  { href: '/blog', key: 'blog' },
  { href: '/aboutus', key: 'about' },
] as const;

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { user, login } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="w-full bg-white border-b border-nv-cream/50">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between gap-3 md:gap-4">
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="Nevlemar" width={220} height={55} priority className="object-contain h-auto w-[140px] md:w-[220px]" />
        </Link>

        <nav className="hidden md:flex items-center gap-7 font-display font-bold text-nv-dark">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href as any}
              className={`text-lg hover:text-black transition ${
                isActive(l.href) ? 'border-b-2 border-nv-cream' : ''
              }`}
            >
              {t(l.key)}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link href="/admin" className="text-lg hover:text-black transition">
              {t('admin')}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher />
          {user ? (
            <span className="hidden md:inline font-display font-semibold text-nv-dark">
              {t('welcome', { name: user.firstName })}
            </span>
          ) : (
            <button
              onClick={login}
              className="hidden sm:inline-flex rounded-full bg-nv-dark text-nv-cream font-semibold px-4 md:px-5 py-2 hover:bg-black transition text-sm"
            >
              {t('login')}
            </button>
          )}
          <button
            className="md:hidden p-2 rounded border border-nv-dark/20"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00172d" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-nv-cream/50 px-6 py-3 flex flex-col gap-3 font-display font-bold text-nv-dark">
          {links.map((l) => (
            <Link key={l.key} href={l.href as any} onClick={() => setMenuOpen(false)}>
              {t(l.key)}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link href="/admin" onClick={() => setMenuOpen(false)}>
              {t('admin')}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
