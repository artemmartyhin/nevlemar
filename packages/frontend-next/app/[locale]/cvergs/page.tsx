import { getTranslations } from 'next-intl/server';
import { api, Dog } from '@/lib/api';
import DogCard from '@/components/DogCard';
import BreedHero from '@/components/BreedHero';

export const dynamic = 'force-dynamic';

async function fetchDogs(): Promise<Dog[]> {
  try {
    const r = await api.post('/dogs/find', { breed: 'cvergsnaucer' });
    return r.data || [];
  } catch {
    return [];
  }
}

export default async function CvergsPage() {
  const t = await getTranslations();
  const dogs = await fetchDogs();
  return (
    <div>
      <BreedHero
        title={t('breeds.cvergsnaucer')}
        subtitle={t('breeds.lookAtOurDogs')}
        crumbs={[{ label: t('nav.home'), href: '/' }, { label: t('breeds.cvergsnaucer') }]}
      />
      <div className="max-w-6xl mx-auto px-6 md:px-10 mt-10">
        {dogs.length === 0 ? (
          <p className="text-center text-nv-text py-12">{t('breeds.noDogs')}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dogs.map((d) => (
              <DogCard key={d._id} dog={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
