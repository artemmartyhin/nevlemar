import { Link } from '@/navigation';
import { PuppiesLitter, uploadUrl } from '@/lib/api';

export default function PuppyCard({ litter }: { litter: PuppiesLitter }) {
  return (
    <Link
      href={`/pups/${litter._id}` as any}
      className="group rounded-2xl overflow-hidden bg-white border border-nv-cream hover:shadow-lg transition block"
    >
      <div className="aspect-[4/3] bg-nv-cream/30 overflow-hidden">
        <img
          src={uploadUrl(litter.image)}
          alt={litter.breed}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>
      <div className="p-4">
        <div className="font-display font-bold text-nv-dark text-lg uppercase">{litter.breed}</div>
        <div className="text-sm text-nv-text mt-2">
          {litter.mom && <span>♀ {litter.mom}</span>} {litter.dad && <span>· ♂ {litter.dad}</span>}
        </div>
        <div className="text-sm text-nv-text mt-1">{litter.puppies?.length ?? 0} puppies</div>
      </div>
    </Link>
  );
}
