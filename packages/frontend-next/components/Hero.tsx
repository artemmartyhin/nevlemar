'use client';

import Image from 'next/image';
import { Link } from '@/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { HeroContent } from '@/lib/siteContent';

export default function Hero({ content }: { content: HeroContent }) {
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const dogX = useSpring(mx, { stiffness: 60, damping: 15 });
  const dogY = useSpring(my, { stiffness: 60, damping: 15 });

  useEffect(() => {
    const h = (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      mx.set(((e.clientX - cx) / r.width) * 18);
      my.set(((e.clientY - cy) / r.height) * 14);
    };
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, [mx, my]);

  const isExternal = (href?: string) =>
    !!href && (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:'));

  return (
    <section className="relative pt-4 md:pt-8 px-4 md:px-8">
      <div
        ref={ref}
        className="relative mx-auto max-w-[1480px] h-[560px] md:h-[760px] rounded-[24px] md:rounded-[40px] overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fbeed5 0%, #f7dba7 55%, #ffe7ba 100%)' }}
      >
        {/* Animated shapes */}
        <motion.div
          aria-hidden
          animate={{ x: [0, -20, 0], y: [0, 20, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[60px] md:top-[100px] right-[-180px] md:right-[-40px] w-[420px] md:w-[640px] h-[420px] md:h-[640px] rounded-full bg-[#00172d] opacity-90"
        />
        <motion.div
          aria-hidden
          animate={{ x: [0, 20, 0], y: [0, -16, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[40px] right-[60px] w-[320px] md:w-[480px] h-[320px] md:h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,231,186,1) 0%, rgba(247,219,167,0) 70%)' }}
        />
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[26%] w-[220px] h-[220px] rounded-full bg-white/50 blur-2xl"
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[80px] left-[8%] w-[58px] h-[58px] rounded-[18px] rotate-[25deg]"
          style={{ background: '#ffd95a' }}
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, 10, 0], rotate: [0, 18, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[140px] left-[52%] w-[22px] h-[22px] rounded-[6px] bg-[#00172d]"
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[56px] left-[66%] w-[16px] h-[16px] rounded-full bg-[#f7dba7]"
        />

        {[
          { x: '12%', y: '45%', r: -12, s: 0.8, d: 0 },
          { x: '26%', y: '18%', r: 14, s: 0.55, d: 1.2 },
          { x: '38%', y: '68%', r: -8, s: 0.7, d: 2.1 },
          { x: '6%', y: '78%', r: 22, s: 0.5, d: 0.8 },
        ].map((p, i) => (
          <motion.div
            key={i}
            aria-hidden
            animate={{ y: [0, -8, 0], rotate: [p.r, p.r + 6, p.r] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: p.d }}
            className="absolute opacity-25 pointer-events-none"
            style={{ left: p.x, top: p.y, transform: `scale(${p.s}) rotate(${p.r}deg)` }}
          >
            <Paw />
          </motion.div>
        ))}

        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
          }}
        />

        {/* DOG — clipped by rounded bottom */}
        <motion.div
          style={{ x: dogX, y: dogY }}
          className="absolute right-[-30%] md:right-[2%] bottom-[-20%] md:bottom-[-56%] w-[85%] md:w-[68%] h-[95%] md:h-[150%] pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-full"
          >
            <Image
              src={content.image || '/main.png'}
              alt="Nevlemar"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain object-bottom"
              style={{ filter: 'drop-shadow(0 30px 40px rgba(0,23,45,0.25))' }}
            />
          </motion.div>
        </motion.div>

        {/* TEXT */}
        <div className="relative z-20 h-full flex flex-col justify-center pl-5 md:pl-16 pr-4 md:pr-16 max-w-[72%] md:max-w-2xl">
          {content.badge && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex self-start items-center gap-2 rounded-full bg-white/70 backdrop-blur border border-nv-dark/10 px-4 py-1.5 text-[11px] font-bold text-nv-dark uppercase tracking-[0.2em]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {content.badge}
            </motion.div>
          )}

          <h1 className="mt-4 md:mt-5 font-display font-semibold text-nv-dark leading-[0.9] tracking-[-0.065em] text-[44px] sm:text-[56px] md:text-[120px]">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="block"
            >
              {content.title || 'Nevlemar'}
            </motion.span>
            {content.sub && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25 }}
                className="block text-[14px] md:text-[24px] font-normal tracking-tight text-nv-dark/65 mt-2 md:mt-4 leading-snug"
              >
                {content.sub}
              </motion.span>
            )}
          </h1>

          {content.tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mt-4 md:mt-5 max-w-md text-nv-dark/80 text-[13px] md:text-base leading-5 md:leading-6 hidden sm:block"
            >
              {content.tagline}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-5 md:mt-7 flex flex-wrap gap-2 md:gap-3"
          >
            {content.ctaPrimaryLabel && (
              isExternal(content.ctaPrimaryHref) ? (
                <a
                  href={content.ctaPrimaryHref}
                  className="group relative inline-flex items-center gap-2 rounded-full bg-nv-dark text-nv-cream font-semibold px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-nv-dark via-[#0a2540] to-nv-dark translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  <span className="relative">{content.ctaPrimaryLabel}</span>
                  <span className="relative transition-transform group-hover:translate-x-1">→</span>
                </a>
              ) : (
                <Link
                  href={(content.ctaPrimaryHref || '/puppies') as any}
                  className="group relative inline-flex items-center gap-2 rounded-full bg-nv-dark text-nv-cream font-semibold px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-nv-dark via-[#0a2540] to-nv-dark translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  <span className="relative">{content.ctaPrimaryLabel}</span>
                  <span className="relative transition-transform group-hover:translate-x-1">→</span>
                </Link>
              )
            )}
            {content.ctaSecondaryLabel && (
              isExternal(content.ctaSecondaryHref) ? (
                <a
                  href={content.ctaSecondaryHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border-2 border-nv-dark text-nv-dark font-semibold px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base hover:bg-nv-dark hover:text-nv-cream transition"
                >
                  {content.ctaSecondaryLabel}
                </a>
              ) : (
                <Link
                  href={(content.ctaSecondaryHref || '/aboutus') as any}
                  className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur border-2 border-nv-dark text-nv-dark font-semibold px-5 md:px-6 py-2.5 md:py-3 text-sm md:text-base hover:bg-nv-dark hover:text-nv-cream transition"
                >
                  {content.ctaSecondaryLabel}
                </Link>
              )
            )}
          </motion.div>

          {content.miniStats && content.miniStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6 md:mt-8 flex items-center gap-3 md:gap-5 text-nv-dark/80 hidden sm:flex"
            >
              {content.miniStats.map((s, i) => (
                <div key={i} className="flex items-center gap-5">
                  {i > 0 && <div className="w-px h-9 bg-nv-dark/20" />}
                  <div>
                    <div className="font-display font-bold text-nv-dark text-xl md:text-2xl leading-none">{s.value}</div>
                    <div className="text-[10px] uppercase tracking-wider text-nv-dark/60 mt-1">{s.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-5 z-20 flex flex-col items-center gap-1 text-nv-dark/55"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold">Scroll</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="w-4 h-7 rounded-full border-2 border-nv-dark/30 flex justify-center pt-1"
          >
            <div className="w-1 h-1.5 rounded-full bg-nv-dark/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Paw() {
  return (
    <svg width="54" height="54" viewBox="0 0 64 64" fill="#00172d">
      <circle cx="32" cy="38" r="11" />
      <ellipse cx="14" cy="24" rx="5" ry="7" />
      <ellipse cx="50" cy="24" rx="5" ry="7" />
      <ellipse cx="22" cy="12" rx="4.5" ry="6" />
      <ellipse cx="42" cy="12" rx="4.5" ry="6" />
    </svg>
  );
}
