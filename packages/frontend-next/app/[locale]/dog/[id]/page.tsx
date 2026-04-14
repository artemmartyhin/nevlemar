import { getTranslations } from 'next-intl/server';
import { api, Dog, uploadUrl } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function fetchDog(id: string): Promise<Dog | null> {
  try {
    const r = await api.get(`/dogs/${id}`);
    return r.data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const dog = await fetchDog(params.id);
  return {
    title: dog?.metaTitle || dog?.name || 'Nevlemar',
    description: dog?.metaDescription || dog?.description || '',
  };
}

export default async function DogProfilePage({ params: { id } }: { params: { id: string } }) {
  const t = await getTranslations();
  const dog = await fetchDog(id);
  if (!dog) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: dog.breed === 'pom' ? t('breeds.pomeranian') : t('breeds.cvergsnaucer'), href: dog.breed === 'pom' ? '/poms' : '/cvergs' },
          { label: dog.name },
        ]}
        variant="light"
      />

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <div className="aspect-square bg-nv-cream/30 rounded-2xl overflow-hidden">
          <img src={uploadUrl(dog.images?.[0])} alt={dog.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <h1 className="font-display font-bold text-nv-dark text-4xl">{dog.name}</h1>
          <div className="mt-2 text-nv-text uppercase text-sm tracking-wide">{dog.breed}</div>
          <div className="mt-6 space-y-2 text-nv-dark">
            <div><span className="font-bold">{t('breeds.born')}: </span>{new Date(dog.born).toLocaleDateString()}</div>
            <div><span className="font-bold">{t('breeds.gender')}: </span>{dog.gender ? t('breeds.male') : t('breeds.female')}</div>
            {dog.mom && <div><span className="font-bold">{t('breeds.mom')}: </span>{dog.mom}</div>}
            {dog.dad && <div><span className="font-bold">{t('breeds.dad')}: </span>{dog.dad}</div>}
          </div>
          {dog.description && <p className="mt-6 text-nv-text leading-7">{dog.description}</p>}
        </div>
      </div>
    </div>
  );
}
