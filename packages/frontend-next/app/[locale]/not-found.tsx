import { Link } from '@/navigation';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="font-display font-bold text-nv-dark text-[120px] leading-none">404</div>
      <p className="text-nv-text text-lg mt-4">Сторінку не знайдено</p>
      <Link href="/" className="mt-6 inline-flex items-center rounded-full bg-nv-dark text-nv-cream px-6 py-3 font-semibold">
        ← На головну
      </Link>
    </div>
  );
}
