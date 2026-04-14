'use client';

import { motion } from 'framer-motion';
import type { ChampionsSection } from '@/lib/siteContent';

export default function ChampionsMarquee({ section }: { section: ChampionsSection }) {
  const items = section.items || [];
  if (items.length === 0) return null;
  const loop = [...items, ...items, ...items];

  return (
    <section className="relative mt-28 py-14 overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(247,219,167,0.4),transparent_70%)]" />
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 text-center">
        {section.eyebrow && (
          <div className="text-xs uppercase tracking-[0.3em] text-nv-dark/60 font-bold">
            {section.eyebrow}
          </div>
        )}
        {section.title && (
          <h2 className="mt-2 font-display font-bold text-nv-dark text-3xl md:text-5xl">
            {section.title}
          </h2>
        )}
        {section.subtitle && <p className="mt-2 text-nv-text">{section.subtitle}</p>}
      </div>

      <div className="relative mt-10">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <motion.div
          animate={{ x: ['0%', '-33.3333%'] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="flex gap-10 whitespace-nowrap will-change-transform"
        >
          {loop.map((c, i) => (
            <div key={i} className="flex items-center gap-10">
              <span className="font-display font-bold text-4xl md:text-6xl text-nv-dark/85 tracking-tight">
                {c}
              </span>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#00172d" strokeWidth="1.8" className="flex-shrink-0">
                <path d="M6 9V5a2 2 0 012-2h8a2 2 0 012 2v4a6 6 0 01-12 0z" />
                <path d="M6 5H3.5A1.5 1.5 0 002 6.5v1a3 3 0 003 3H6" />
                <path d="M18 5h2.5A1.5 1.5 0 0122 6.5v1a3 3 0 01-3 3H18" />
                <path d="M9 15v3" />
                <path d="M15 15v3" />
                <path d="M8 21h8" />
              </svg>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
