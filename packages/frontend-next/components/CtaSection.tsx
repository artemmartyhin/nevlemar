'use client';

import { Link } from '@/navigation';
import { motion } from 'framer-motion';
import type { CtaSectionContent } from '@/lib/siteContent';

export default function CtaSection({ section }: { section: CtaSectionContent }) {
  if (!section.title && !section.eyebrow) return null;

  const isExternal = (href?: string) =>
    !!href && (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'));

  const Btn1 = isExternal(section.primaryHref) ? 'a' : Link;
  const Btn2 = isExternal(section.secondaryHref) ? 'a' : Link;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 mt-28">
      <div className="relative overflow-hidden rounded-[40px] p-10 md:p-20 text-center" style={{
        background: 'linear-gradient(135deg, #00172d 0%, #0a2540 55%, #00172d 100%)',
      }}>
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/2 w-[900px] h-[900px]"
          style={{
            background: 'conic-gradient(from 0deg, rgba(247,219,167,0.2), rgba(255,217,90,0.3), rgba(247,219,167,0.2))',
            borderRadius: '40%',
          }}
        />
        <div aria-hidden className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-nv-cream/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-nv-cream">
          {section.eyebrow && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full bg-nv-cream/10 border border-nv-cream/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] font-bold"
            >
              ★ {section.eyebrow}
            </motion.div>
          )}
          {section.title && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-5 font-display font-bold text-[40px] md:text-[64px] leading-[1.05]"
            >
              {section.title}
            </motion.h2>
          )}
          {section.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-5 text-lg md:text-xl opacity-90"
            >
              {section.subtitle}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
          >
            {section.primaryLabel && (
              <Btn1
                href={(section.primaryHref || '/puppies') as any}
                {...(isExternal(section.primaryHref) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group relative inline-flex items-center gap-2 rounded-full bg-nv-cream text-nv-dark font-bold px-8 py-4 hover:scale-105 transition-transform shadow-2xl"
              >
                {section.primaryLabel}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Btn1>
            )}
            {section.secondaryLabel && (
              <Btn2
                href={(section.secondaryHref || '/aboutus') as any}
                {...(isExternal(section.secondaryHref) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex items-center gap-2 rounded-full border-2 border-nv-cream/40 text-nv-cream font-bold px-8 py-4 hover:bg-nv-cream/10 transition"
              >
                {section.secondaryLabel}
              </Btn2>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
