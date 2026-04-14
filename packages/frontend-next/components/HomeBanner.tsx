'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function HomeBanner() {
  const t = useTranslations('home.banner');
  return (
    <div className="relative w-full rounded-[24px] overflow-hidden bg-nv-dark text-nv-cream">
      <div aria-hidden className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-nv-cream/10 rotate-[25deg]" />
      <div aria-hidden className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-nv-cream/5 rotate-[-15deg]" />
      <div className="relative grid md:grid-cols-2 gap-6 items-center px-8 md:px-14 py-14">
        <div>
          <h2 className="font-display font-bold text-[36px] md:text-[48px] leading-tight">{t('title')}</h2>
          <p className="mt-4 opacity-90 leading-7 max-w-md">{t('text')}</p>
          <Link href="/puppies" className="inline-flex mt-6 items-center gap-2 rounded-full bg-nv-cream text-nv-dark font-semibold px-6 py-3 hover:bg-white transition">
            {t('cta')} →
          </Link>
        </div>
        <div className="relative h-[220px] md:h-[260px]">
          <img src="/banner.jpg" alt="Nevlemar" className="w-full h-full object-cover rounded-xl border border-nv-cream/40 shadow-2xl" />
        </div>
      </div>
    </div>
  );
}
