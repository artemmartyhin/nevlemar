'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const testiVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d >= 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d >= 0 ? -60 : 60 }),
};
import ResponsiveBlock from './ResponsiveBlock';
import type { TestimonialsSection, Testimonial } from '@/lib/siteContent';

export default function Testimonials({ section }: { section: TestimonialsSection }) {
  const items = section.items || [];
  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 mt-28">
      <div className="text-center max-w-2xl mx-auto">
        {section.eyebrow && <div className="text-xs uppercase tracking-[0.3em] text-nv-dark/60 font-bold">{section.eyebrow}</div>}
        {section.title && <h2 className="mt-2 font-display font-bold text-nv-dark text-4xl md:text-5xl">{section.title}</h2>}
        {section.subtitle && <p className="mt-3 text-nv-text">{section.subtitle}</p>}
      </div>
      <ResponsiveBlock
        desktop={
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {items.map((it, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.12 }}
              >
                <Card {...it} />
              </motion.div>
            ))}
          </div>
        }
        mobile={<Swipe items={items} />}
      />
    </section>
  );
}

function Card({ name, text, role }: Testimonial) {
  return (
    <div className="group relative rounded-3xl bg-white border border-nv-cream/60 p-8 hover:shadow-2xl hover:-translate-y-1 transition-all">
      <div className="text-nv-cream text-6xl font-display font-bold leading-none mb-3 select-none">"</div>
      <p className="text-nv-dark/90 leading-7 italic">{text}</p>
      <div className="mt-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nv-cream to-nv-yellow flex items-center justify-center font-bold text-nv-dark text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-display font-bold text-nv-dark">{name}</div>
          <div className="text-xs text-nv-text">{role}</div>
        </div>
      </div>
    </div>
  );
}

function Swipe({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(0);
  const go = (next: number) => {
    const n = (next + items.length) % items.length;
    setDir(n > i || (i === items.length - 1 && n === 0) ? 1 : -1);
    setI(n);
  };
  return (
    <div className="mt-10 select-none">
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={i}
            custom={dir}
            variants={testiVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -300) go(i + 1);
              else if (info.offset.x > 60 || info.velocity.x > 300) go(i - 1);
            }}
            className="touch-pan-y cursor-grab active:cursor-grabbing"
          >
            <Card {...items[i]} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-2 mt-5">
        {items.map((_, j) => (
          <button
            key={j}
            onClick={() => go(j)}
            aria-label={`Go to testimonial ${j + 1}`}
            className={`h-2 rounded-full transition-all ${i === j ? 'w-8 bg-nv-dark' : 'w-2 bg-nv-dark/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
