import { getTranslations } from 'next-intl/server';
import { api, PuppiesLitter, uploadUrl } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

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

export default async function PupsPage({ params: { id } }: { params: { id: string } }) {
  const t = await getTranslations();
  const litter = await fetchLitter(id);
  if (!litter) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), href: '/' },
          { label: t('puppies.title'), href: '/puppies' },
          { label: litter.breed.toUpperCase() },
        ]}
        variant="light"
      />
      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <div className="aspect-square bg-nv-cream/30 rounded-2xl overflow-hidden">
          <img src={uploadUrl(litter.image)} alt={litter.breed} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="font-display font-bold text-nv-dark text-4xl uppercase">{litter.breed}</h1>
          <div className="mt-6 space-y-2 text-nv-dark">
            {litter.mom && <div><span className="font-bold">{t('breeds.mom')}: </span>{litter.mom}</div>}
            {litter.dad && <div><span className="font-bold">{t('breeds.dad')}: </span>{litter.dad}</div>}
          </div>
          {litter.description && <p className="mt-6 text-nv-text leading-7">{litter.description}</p>}
        </div>
      </div>

      {litter.puppies?.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display font-bold text-nv-dark text-2xl mb-6">{t('puppies.litter')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {litter.puppies.map((p, i) => (
              <div key={i} className="rounded-xl bg-white border border-nv-cream overflow-hidden">
                <div className="aspect-square bg-nv-cream/20">
                  <img src={uploadUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <div className="font-display font-bold text-nv-dark">{p.name}</div>
                  <div className="text-xs text-nv-text">{new Date(p.born).toLocaleDateString()} · {p.gender}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
