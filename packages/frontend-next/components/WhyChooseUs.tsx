'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ResponsiveBlock from './ResponsiveBlock';
import type { WhySection } from '@/lib/siteContent';

export default function WhyChooseUs({ section }: { section: WhySection }) {
  const items = section.items || [];
  if (items.length === 0) return null;

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

      <ResponsiveBlock
        desktop={
          <div className="mt-14 grid md:grid-cols-4 gap-6">
            {items.map((k, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl bg-white border border-nv-cream/60 p-7 hover:shadow-2xl hover:border-nv-dark/20 transition-all"
              >
                <div className="absolute -top-6 left-7 w-14 h-14 rounded-2xl bg-nv-dark flex items-center justify-center text-nv-cream text-2xl font-bold shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  {k.icon}
                </div>
                <div className="pt-6">
                  <h3 className="font-display font-bold text-nv-dark text-xl">{k.title}</h3>
                  <p className="text-nv-text text-sm mt-2 leading-6">{k.text}</p>
                </div>
                <div className="absolute bottom-3 right-4 text-[96px] font-display font-bold text-nv-cream/30 leading-none pointer-events-none select-none">
                  0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        }
        mobile={<Accordion items={items} />}
      />
    </section>
  );
}

function Accordion({ items }: { items: { icon: string; title: string; text: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-10 space-y-3">
      {items.map((it, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="rounded-2xl border border-nv-cream bg-nv-cream/20 overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center gap-3 px-4 py-4 font-display font-bold text-nv-dark text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-nv-dark flex items-center justify-center text-nv-cream">
              {it.icon}
            </div>
            <span className="flex-1">{it.title}</span>
            <span className="text-xl">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <div className="px-4 pb-4 text-sm text-nv-text leading-6">{it.text}</div>}
        </motion.div>
      ))}
    </div>
  );
}
