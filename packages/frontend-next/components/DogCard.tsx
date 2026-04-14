import { Link } from '@/navigation';
import { Dog, uploadUrl } from '@/lib/api';

export default function DogCard({ dog, compact = false }: { dog: Dog; compact?: boolean }) {
  return (
    <Link
      href={`/dog/${dog._id}` as any}
      className="group rounded-2xl overflow-hidden bg-white border border-nv-cream hover:border-nv-dark hover:shadow-lg transition block"
    >
      <div className={`${compact ? 'aspect-[4/3]' : 'aspect-square'} bg-nv-cream/30 overflow-hidden`}>
        <img
          src={uploadUrl(dog.images?.[0])}
          alt={dog.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>
      <div className="p-4">
        <div className="font-display font-semibold text-nv-dark text-lg tracking-tight">{dog.name}</div>
        <div className="text-[11px] text-nv-text mt-1 uppercase tracking-wider">
          {dog.breed} · {dog.gender ? '♂' : '♀'}
        </div>
        {!compact && (
          <div className="text-sm text-nv-text mt-2">{new Date(dog.born).toLocaleDateString()}</div>
        )}
      </div>
    </Link>
  );
}
