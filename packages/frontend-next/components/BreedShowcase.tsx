'use client';

import { Link } from '@/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import type { BreedsSection } from '@/lib/siteContent';

export default function BreedShowcase({ section }: { section: BreedsSection }) {
  const cards = section.cards || [];
  if (cards.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 mt-28">
      <div className="text-center max-w-2xl mx-auto">
        {section.eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-nv-dark/60 font-bold"
          >
            {section.eyebrow}
          </motion.div>
        )}
        {section.title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 font-display font-bold text-nv-dark text-4xl md:text-5xl"
          >
            {section.title}
          </motion.h2>
        )}
        {section.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-nv-text"
          >
            {section.subtitle}
          </motion.p>
        )}
      </div>

      <div className="mt-12 grid md:grid-cols-2 gap-6 md:gap-8">
        {cards.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={b.href as any}
              className={`group relative block rounded-[32px] overflow-hidden aspect-[4/5] md:aspect-[5/6] ${i === 0 ? '-rotate-[2deg]' : 'rotate-[2deg]'} hover:rotate-0 transition-transform duration-500`}
            >
              <div className={`absolute inset-0 ${b.dark ? 'bg-gradient-to-br from-[#00172d] to-[#0a2540]' : 'bg-gradient-to-br from-[#f7dba7] to-[#ffe7ba]'}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.3)_0%,transparent_50%)]" />

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute -top-20 -right-16 w-60 h-60 rounded-full ${b.dark ? 'bg-nv-cream/10' : 'bg-white/30'}`}
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className={`absolute -bottom-28 -left-16 w-72 h-72 rounded-full ${b.dark ? 'bg-nv-yellow/10' : 'bg-nv-dark/10'}`}
              />

              <div className="absolute inset-0 flex items-end justify-center">
                <Image
                  src={b.image}
                  alt={b.title}
                  width={520}
                  height={780}
                  className="w-[82%] max-w-sm h-[90%] object-contain object-bottom transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2"
                />
              </div>

              <div className={`absolute inset-0 p-6 md:p-8 flex flex-col justify-between ${b.dark ? 'text-nv-cream' : 'text-nv-dark'}`}>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] opacity-70 font-bold">Breed #{i + 1}</div>
                  <h3 className="mt-2 font-display font-bold text-3xl md:text-5xl leading-[0.95]">
                    {b.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm md:text-base opacity-85">
                    {b.description}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-semibold">
                    {section.exploreLabel || 'Explore'}
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      →
                    </motion.span>
                  </span>
                  <span className={`text-6xl font-display font-bold opacity-20 ${b.dark ? 'text-nv-cream' : 'text-nv-dark'}`}>
                    0{i + 1}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
