import { getTranslations } from 'next-intl/server';
import { api, Dog } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import DogCard from '@/components/DogCard';
import DogGallery from '@/components/DogGallery';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function fetchDog(id: string, locale?: string): Promise<Dog | null> {
  try {
    const r = await api.get(`/dogs/${id}`, { params: { locale } });
    return r.data;
  } catch {
    return null;
  }
}

// Accept both ObjectId refs (24 hex chars) and legacy free-text names.
const isObjectId = (s?: string) => !!s && /^[a-f0-9]{24}$/i.test(s);

async function fetchParent(id?: string, locale?: string): Promise<Dog | null> {
  if (!id || !isObjectId(id)) return null;
  return fetchDog(id, locale);
}

export async function generateMetadata({ params }: { params: { id: string; locale: string } }) {
  const dog = await fetchDog(params.id, params.locale);
  return {
    title: dog?.metaTitle || dog?.name || 'Nevlemar',
    description: dog?.metaDescription || dog?.description || '',
  };
}

export default async function DogProfilePage({ params: { id, locale } }: { params: { id: string; locale: string } }) {
  const t = await getTranslations();
  const dog = await fetchDog(id, locale);
  if (!dog) notFound();

  const [mom, dad] = await Promise.all([fetchParent(dog.mom, locale), fetchParent(dog.dad, locale)]);
  // Legacy: if mom/dad is a free-text string (not an id), show as plain text
  const momText = !isObjectId(dog.mom) && dog.mom ? dog.mom : undefined;
  const dadText = !isObjectId(dog.dad) && dog.dad ? dog.dad : undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          {
            label: dog.breed === 'pom' ? t('breeds.pomeranian') : t('breeds.cvergsnaucer'),
            href: dog.breed === 'pom' ? '/poms' : '/cvergs',
          },
          { label: dog.name },
        ]}
        variant="light"
      />

      <div className="grid md:grid-cols-[7fr_5fr] gap-8 md:gap-12 mt-6 items-start">
        <DogGallery images={dog.images || []} alt={dog.name} />

        <div>
          <h1 className="font-display font-bold text-nv-dark text-4xl tracking-tight">{dog.name}</h1>
          <div className="mt-2 text-nv-text uppercase text-sm tracking-wide">{dog.breed}</div>
          <div className="mt-6 space-y-2 text-nv-dark">
            <div>
              <span className="font-bold">{t('breeds.born')}: </span>
              {new Date(dog.born).toLocaleDateString()}
            </div>
            <div>
              <span className="font-bold">{t('breeds.gender')}: </span>
              {dog.gender ? t('breeds.male') : t('breeds.female')}
            </div>
            {momText && (
              <div>
                <span className="font-bold">{t('breeds.mom')}: </span>
                {momText}
              </div>
            )}
            {dadText && (
              <div>
                <span className="font-bold">{t('breeds.dad')}: </span>
                {dadText}
              </div>
            )}
          </div>
          {dog.description && <p className="mt-6 text-nv-text leading-7">{dog.description}</p>}
        </div>
      </div>

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
