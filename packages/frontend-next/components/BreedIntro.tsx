'use client';

import { motion } from 'framer-motion';

export default function BreedIntro({
  description,
  stats,
}: {
  description?: string;
  stats?: Array<{ label: string; value: string }>;
}) {
  if (!description && (!stats || stats.length === 0)) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 mt-16">
      <div className="grid md:grid-cols-[2fr_3fr] gap-6 md:gap-14 items-start">
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-nv-dark text-xl md:text-3xl leading-snug tracking-tight"
          >
            {description}
          </motion.p>
        )}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl bg-nv-cream/30 border border-nv-cream p-5"
              >
                <div className="text-[11px] uppercase tracking-[0.25em] text-nv-dark/60 font-semibold">
                  {s.label}
                </div>
                <div className="mt-1 font-display font-bold text-nv-dark text-xl md:text-2xl tracking-tight">
                  {s.value}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
