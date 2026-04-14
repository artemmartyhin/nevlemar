'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Breadcrumbs from './Breadcrumbs';

export default function BreedHero({
  title,
  subtitle,
  image,
  crumbs,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  crumbs: { label: string; href?: string }[];
}) {
  return (
    <section className="relative pt-4 md:pt-8 px-4 md:px-8">
      <div
        className="relative mx-auto max-w-[1480px] h-[340px] md:h-[480px] rounded-[24px] md:rounded-[40px] overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #fbeed5 0%, #f7dba7 55%, #ffe7ba 100%)' }}
      >
        {/* Animated decorative shapes */}
        <motion.div
          aria-hidden
          animate={{ x: [0, -20, 0], y: [0, 20, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-60px] right-[-100px] w-[480px] h-[480px] rounded-full bg-[#00172d] opacity-90"
        />
        <motion.div
          aria-hidden
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[30%] right-[20%] w-[240px] h-[240px] rounded-full bg-white/40 blur-2xl"
        />
        <motion.div
          aria-hidden
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[50px] left-[8%] w-[48px] h-[48px] rounded-[16px] rotate-[25deg]"
          style={{ background: '#ffd95a' }}
        />

        {/* Subtle grain */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.1] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Dog image on the right, clipped by rounded bottom */}
        {image && (
          <div className="absolute right-[-30%] md:right-[2%] bottom-[-15%] md:bottom-[-46%] w-[75%] md:w-[55%] h-[90%] md:h-[145%] pointer-events-none">
            <Image
              src={image}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain object-bottom"
              style={{ filter: 'drop-shadow(0 20px 35px rgba(0,23,45,0.22))' }}
            />
          </div>
        )}

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-center pl-5 md:pl-16 pr-4 md:pr-16 max-w-[68%] md:max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Breadcrumbs items={crumbs} variant="light" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 md:mt-4 font-display font-semibold text-nv-dark leading-[0.92] tracking-[-0.04em] text-[32px] sm:text-[44px] md:text-[80px]"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-3 md:mt-4 max-w-md text-nv-dark/70 text-xs md:text-lg leading-snug md:leading-relaxed hidden sm:block"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
