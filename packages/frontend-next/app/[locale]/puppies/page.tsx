import { getTranslations } from 'next-intl/server';
import { api, PuppiesLitter } from '@/lib/api';
import PuppyCard from '@/components/PuppyCard';
import BreedHero from '@/components/BreedHero';
import ContactCta from '@/components/ContactCta';
import { getSiteContent } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

async function fetchLitters(): Promise<PuppiesLitter[]> {
  try {
    const r = await api.get('/puppies');
    return r.data || [];
  } catch {
    return [];
  }
}

export default async function PuppiesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations();
  const [litters, site] = await Promise.all([fetchLitters(), getSiteContent(locale)]);

  const page = site.puppiesPage || {};
  const title = page.title || t('puppies.title');
  const subtitle = page.subtitle || t('puppies.subtitle');
  const image = page.heroImage || '/main.png';

  return (
    <div className="overflow-x-hidden">
      <BreedHero
        title={title}
        subtitle={subtitle}
        image={image}
        crumbs={[{ label: t('nav.home'), href: '/' }, { label: title }]}
      />
      <section className="max-w-6xl mx-auto px-6 md:px-10 mt-14 mb-12">
        {litters.length === 0 ? (
          <p className="text-center text-nv-text py-12">{t('puppies.empty')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {litters.map((l) => (
              <PuppyCard key={l._id} litter={l} />
            ))}
          </div>
        )}
      </section>

      <ContactCta
        title={site.ctaSection?.title || 'Готові зустрітися?'}
        subtitle={site.ctaSection?.subtitle || 'Напишіть нам, і ми організуємо зустріч зі щенятами у зручний для вас час.'}
        primaryLabel="Зв'язатися з нами"
        primaryHref="/aboutus"
        secondaryLabel={t('nav.pomeranian')}
        secondaryHref="/poms"
        phone={site.about?.phone}
        email={site.about?.email}
      />

      <div className="h-20" />
    </div>
  );
}
