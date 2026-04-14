import { getTranslations } from 'next-intl/server';
import { api, PuppiesLitter } from '@/lib/api';
import PuppyCard from '@/components/PuppyCard';
import BreedHero from '@/components/BreedHero';

export const dynamic = 'force-dynamic';

async function fetchLitters(): Promise<PuppiesLitter[]> {
  try {
    const r = await api.get('/puppies');
    return r.data || [];
  } catch {
    return [];
  }
}

export default async function PuppiesPage() {
  const t = await getTranslations();
  const litters = await fetchLitters();
  return (
    <div>
      <BreedHero
        title={t('puppies.title')}
        subtitle={t('puppies.subtitle')}
        crumbs={[{ label: t('nav.home'), href: '/' }, { label: t('puppies.title') }]}
      />
      <div className="max-w-6xl mx-auto px-6 md:px-10 mt-10 mb-20">
        {litters.length === 0 ? (
          <p className="text-center text-nv-text py-12">{t('puppies.empty')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {litters.map((l) => (
              <PuppyCard key={l._id} litter={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
