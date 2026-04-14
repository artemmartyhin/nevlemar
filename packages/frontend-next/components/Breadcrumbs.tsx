import { Link } from '@/navigation';

export default function Breadcrumbs({
  items,
  variant = 'dark',
}: {
  items: { label: string; href?: string }[];
  variant?: 'dark' | 'light';
}) {
  const linkCls = variant === 'dark' ? 'text-nv-cream hover:underline' : 'text-nv-dark/70 hover:underline';
  const currentCls = variant === 'dark' ? 'text-white' : 'text-nv-dark font-semibold';
  const sepCls = variant === 'dark' ? 'text-nv-cream/60' : 'text-nv-dark/40';
  return (
    <nav className="text-sm font-display flex flex-wrap items-center gap-1" aria-label="Breadcrumb">
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {it.href && !isLast ? (
              <Link href={it.href as any} className={linkCls}>
                {it.label}
              </Link>
            ) : (
              <span className={currentCls}>{it.label}</span>
            )}
            {!isLast && <span className={sepCls}>/</span>}
          </span>
        );
      })}
    </nav>
  );
}
