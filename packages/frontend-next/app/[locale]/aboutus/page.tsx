import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSiteContent } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations();
  const site = await getSiteContent(locale);
  const about = site.about || {};

  return (
    <div>
      <section className="relative w-full overflow-hidden bg-nv-gradient rounded-b-[24px] min-h-[480px]">
        <div aria-hidden className="hidden md:block absolute -right-10 top-16 w-[520px] h-[520px] rounded-full bg-nv-cream rotate-[9deg]" />
        <div aria-hidden className="hidden md:block absolute right-20 top-10 w-[520px] h-[520px] rounded-full bg-nv-dark rotate-[25deg]" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-10 pb-10 grid md:grid-cols-2 gap-6 items-end">
          <div className="relative z-10">
            <Breadcrumbs items={[{ label: t('nav.home'), href: '/' }, { label: about.title || t('about.title') }]} variant="light" />
            <h1 className="font-display font-bold text-nv-dark text-[40px] md:text-[56px] leading-tight mt-3">
              {about.title || t('about.title')}
            </h1>
            <p className="mt-4 max-w-md text-nv-text leading-7">{about.intro || t('about.intro')}</p>

            <h3 className="font-display font-bold text-nv-dark text-xl mt-8">
              {about.followUsLabel || t('about.followUs')}
            </h3>
            <div className="mt-3 flex gap-3">
              {about.facebook && (
                <a href={about.facebook} target="_blank" rel="noopener noreferrer"
                  className="rounded-full bg-nv-dark text-nv-cream font-semibold px-5 py-2.5 hover:bg-black transition">
                  Facebook
                </a>
              )}
              {about.instagram && (
                <a href={about.instagram} target="_blank" rel="noopener noreferrer"
                  className="rounded-full bg-nv-dark text-nv-cream font-semibold px-5 py-2.5 hover:bg-black transition">
                  Instagram
                </a>
              )}
            </div>
          </div>
          <div className="relative h-[360px] md:h-[460px] -mb-16 overflow-visible flex items-end justify-center">
            <Image
              src={about.image || '/main.png'}
              alt={about.title || 'Nevlemar'}
              width={800}
              height={1200}
              className="object-contain object-bottom w-full h-full"
            />
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 md:px-10 py-16 text-center">
        <h2 className="font-display font-bold text-nv-dark text-3xl">
          {about.contactTitle || t('about.contactTitle')}
        </h2>
        <p className="text-nv-text mt-3">{about.contactText || t('about.contactText')}</p>
        <div className="mt-8 space-y-3 text-nv-dark">
          {about.phone && (
            <div>
              <span className="font-bold">{t('about.phone')}: </span>
              <a className="underline" href={`tel:${about.phone.replace(/[^+\d]/g, '')}`}>
                {about.phone}
              </a>
            </div>
          )}
          {about.email && (
            <div>
              <span className="font-bold">{t('about.email')}: </span>
              <a className="underline" href={`mailto:${about.email}`}>
                {about.email}
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
