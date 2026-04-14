'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { BlogCategory } from '@/lib/api';

export default function BlogFilters({
  categories,
  active,
  onChange,
  search,
  onSearchChange,
}: {
  categories: BlogCategory[];
  active: string;
  onChange: (slug: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
}) {
  const t = useTranslations('blog');
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
      <div className="flex flex-wrap gap-2">
        <Chip active={active === 'all'} onClick={() => onChange('all')}>{t('allCategories')}</Chip>
        {categories.map((c) => (
          <Chip key={c.slug} active={active === c.slug} onClick={() => onChange(c.slug)}>
            {c.name}
          </Chip>
        ))}
      </div>
      <div className="relative md:w-72">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00172d" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={`${t('search' as any) || 'Пошук'}...`}
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-nv-dark/20 font-display focus:outline-none focus:border-nv-dark transition"
        />
      </div>
    </div>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 rounded-full font-display font-semibold text-sm transition ${
        active ? 'text-nv-cream' : 'text-nv-dark hover:bg-nv-cream/40'
      }`}
    >
      {active && (
        <motion.span
          layoutId="activeChip"
          className="absolute inset-0 bg-nv-dark rounded-full"
          transition={{ type: 'spring', duration: 0.4 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
