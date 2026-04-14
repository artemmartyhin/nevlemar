import { getTranslations } from 'next-intl/server';
import { api, PuppiesLitter, Dog } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import DogCard from '@/components/DogCard';
import PupsGallery from '@/components/PupsGallery';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const isObjectId = (s?: string) => !!s && /^[a-f0-9]{24}$/i.test(s);

async function fetchDog(id?: string, locale?: string): Promise<Dog | null> {
  if (!id || !isObjectId(id)) return null;
  try {
    const r = await api.get(`/dogs/${id}`, { params: { locale } });
    return r.data;
  } catch {
    return null;
  }
}

async function fetchLitter(id: string): Promise<PuppiesLitter | null> {
  try {
    const r = await api.get(`/puppies/${id}`);
    return r.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const l = await fetchLitter(params.id);
  return {
    title: l?.metaTitle || l?.breed || 'Nevlemar puppies',
    description: l?.metaDescription || l?.description || '',
  };
}

export default async function PupsPage({
  params: { id, locale },
}: {
  params: { id: string; locale: string };
}) {
  const t = await getTranslations();
  const litter = await fetchLitter(id);
  if (!litter) notFound();

  const [mom, dad] = await Promise.all([
    fetchDog(litter.mom, locale),
    fetchDog(litter.dad, locale),
  ]);
  const momText = !isObjectId(litter.mom) && litter.mom ? litter.mom : undefined;
  const dadText = !isObjectId(litter.dad) && litter.dad ? litter.dad : undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('puppies.title'), href: '/puppies' },
          { label: litter.breed.toUpperCase() },
        ]}
        variant="light"
      />

      <PupsGallery
        cover={litter.image}
        puppies={(litter.puppies || []).map((p: any) => ({
          name: p.name,
          born: p.born,
          gender: p.gender,
          image: p.image,
        }))}
        breed={litter.breed}
        name={litter.name}
        description={litter.description}
        momText={momText}
        dadText={dadText}
        t={{
          mom: t('breeds.mom'),
          dad: t('breeds.dad'),
          litter: t('puppies.litter'),
          male: t('breeds.male'),
          female: t('breeds.female'),
          born: t('breeds.born'),
        }}
      />

      {(mom || dad) && (
        <section className="mt-14">
          <h2 className="font-display font-semibold text-nv-dark text-2xl md:text-3xl tracking-tight">
            {t('breeds.parents')}
          </h2>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
            {mom && (
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-nv-text font-semibold mb-2">
                  ♀ {t('breeds.mom')}
                </div>
                <DogCard dog={mom} compact />
              </div>
            )}
            {dad && (
              <div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-nv-text font-semibold mb-2">
                  ♂ {t('breeds.dad')}
                </div>
                <DogCard dog={dad} compact />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
