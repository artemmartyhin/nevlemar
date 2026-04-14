import { Link } from '@/navigation';
import { Dog, uploadUrl } from '@/lib/api';

export default function DogCard({ dog }: { dog: Dog }) {
  return (
    <Link
      href={`/dog/${dog._id}` as any}
      className="group rounded-2xl overflow-hidden bg-white border border-nv-cream hover:shadow-lg transition block"
    >
      <div className="aspect-square bg-nv-cream/30 overflow-hidden">
        <img
          src={uploadUrl(dog.images?.[0])}
          alt={dog.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>
      <div className="p-4">
        <div className="font-display font-bold text-nv-dark text-lg">{dog.name}</div>
        <div className="text-xs text-nv-text mt-1 uppercase tracking-wide">{dog.breed}</div>
        <div className="text-sm text-nv-text mt-2">
          {new Date(dog.born).toLocaleDateString()} · {dog.gender ? '♂' : '♀'}
        </div>
      </div>
    </Link>
  );
}
