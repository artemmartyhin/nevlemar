import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import BreedShowcase from '@/components/BreedShowcase';
import WhyChooseUs from '@/components/WhyChooseUs';
import ChampionsMarquee from '@/components/ChampionsMarquee';
import BlogPreview from '@/components/BlogPreview';
import Testimonials from '@/components/Testimonials';
import CtaSection from '@/components/CtaSection';
import { getSiteContent } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const site = await getSiteContent(locale);
  return (
    <div className="overflow-x-hidden">
      <Hero content={site.hero || {}} />
      <Stats items={site.stats || []} />
      <BreedShowcase section={site.breedsSection || {}} />
      <WhyChooseUs section={site.whySection || {}} />
      <ChampionsMarquee section={site.championsSection || {}} />
      <BlogPreview locale={locale} />
      <Testimonials section={site.testimonialsSection || {}} />
      <CtaSection section={site.ctaSection || {}} />
      <div className="h-20" />
    </div>
  );
}
