import { getTranslations } from 'next-intl/server';
import { api, Dog } from '@/lib/api';
import DogCard from '@/components/DogCard';
import BreedHero from '@/components/BreedHero';
import BreedIntro from '@/components/BreedIntro';
import ContactCta from '@/components/ContactCta';
import { getSiteContent } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

async function fetchDogs(locale?: string): Promise<Dog[]> {
  try {
    const r = await api.post('/dogs/find', { breed: 'cvergsnaucer' }, { params: { locale } });
    return r.data || [];
  } catch {
    return [];
  }
}

export default async function CvergsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations();
  const [dogs, site] = await Promise.all([fetchDogs(locale), getSiteContent(locale)]);

  const card = site.breedsSection?.cards?.find((c) => c.slug === 'cvergsnaucer') || site.breedsSection?.cards?.[1];
  const title = card?.title || t('breeds.cvergsnaucer');
  const description = card?.description;
  const image = (card as any)?.heroImage || card?.image || '/main.png';

  const males = dogs.filter((d) => d.gender).length;
  const females = dogs.length - males;

  return (
    <div className="overflow-x-hidden">
      <BreedHero
        title={title}
        subtitle={t('breeds.lookAtOurDogs')}
        image={image}
        crumbs={[{ label: t('nav.home'), href: '/' }, { label: title }]}
      />

      <BreedIntro
        description={description}
        stats={[
          { label: t('breeds.gender'), value: `${males} ♂  ·  ${females} ♀` },
        ]}
      />

      <section className="max-w-6xl mx-auto px-6 md:px-10 mt-16">
        {dogs.length === 0 ? (
          <p className="text-center text-nv-text py-12">{t('breeds.noDogs')}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dogs.map((d) => (
              <DogCard key={d._id} dog={d} />
            ))}
          </div>
        )}
      </section>

      <ContactCta
        title={site.ctaSection?.title || 'Зацікавилися породою?'}
        subtitle={site.ctaSection?.subtitle || 'Напишіть нам, і ми розкажемо все про наших собак, планові в\'язки та доступних цуценят.'}
        primaryLabel="Зв'язатися з нами"
        primaryHref="/aboutus"
        secondaryLabel={t('nav.puppies')}
        secondaryHref="/puppies"
        phone={site.about?.phone}
        email={site.about?.email}
      />

      <div className="h-20" />
    </div>
  );
}
