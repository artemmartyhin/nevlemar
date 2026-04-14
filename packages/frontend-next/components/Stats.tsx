'use client';

import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { StatItem } from '@/lib/siteContent';

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (n) => Math.round(n).toString() + suffix);

  useEffect(() => {
    if (inView) {
      const c = animate(count, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
      return c.stop;
    }
  }, [inView, count, to]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function Stats({ items }: { items: StatItem[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 mt-24">
      <div className="relative rounded-[32px] bg-nv-dark text-nv-cream overflow-hidden">
        <div aria-hidden className="absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full bg-nv-cream/10 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full bg-nv-yellow/10 blur-3xl" />
        <div className="relative grid grid-cols-2 md:grid-cols-4 divide-nv-cream/15 md:divide-x">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="px-6 md:px-10 py-10 md:py-14 text-center"
            >
              <div className="font-display font-bold text-[56px] md:text-[72px] leading-none bg-gradient-to-b from-nv-cream to-nv-yellow bg-clip-text text-transparent">
                <Counter to={it.value} suffix={it.suffix} />
              </div>
              <div className="mt-3 text-xs md:text-sm uppercase tracking-[0.2em] opacity-80">
                {it.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
