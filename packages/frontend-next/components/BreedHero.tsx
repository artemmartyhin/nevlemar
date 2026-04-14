import Breadcrumbs from './Breadcrumbs';

export default function BreedHero({ title, subtitle, crumbs }: { title: string; subtitle: string; crumbs: { label: string; href?: string }[] }) {
  return (
    <section className="relative w-full rounded-b-[24px] overflow-hidden bg-nv-dark text-nv-cream">
      <div aria-hidden className="absolute -top-10 right-0 w-[520px] h-[520px] rounded-full bg-nv-cream/10 rotate-[25deg]" />
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-14">
        <Breadcrumbs items={crumbs} variant="dark" />
        <h1 className="font-display font-bold text-[36px] md:text-[48px] mt-3">{title}</h1>
        <p className="opacity-90 mt-2">{subtitle}</p>
      </div>
    </section>
  );
}
