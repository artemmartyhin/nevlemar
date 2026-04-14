import { api } from './api';

export type HeroContent = {
  badge?: string;
  title?: string;
  sub?: string;
  tagline?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryHref?: string;
  miniStats?: Array<{ value: string; label: string }>;
  image?: string;
};

export type StatItem = { value: number; suffix?: string; label: string };

export type BreedCard = {
  slug: string;
  title: string;
  description: string;
  href: string;
  image: string;
  dark?: boolean;
};

export type BreedsSection = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  exploreLabel?: string;
  cards?: BreedCard[];
};

export type WhyItem = { icon: string; title: string; text: string };
export type WhySection = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: WhyItem[];
};

export type ChampionsSection = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: string[];
};

export type Testimonial = { name: string; role: string; text: string };
export type TestimonialsSection = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  items?: Testimonial[];
};

export type CtaSectionContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export type AboutContent = {
  title?: string;
  intro?: string;
  followUsLabel?: string;
  contactTitle?: string;
  contactText?: string;
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
};

export type FooterContent = {
  tagline?: string;
  rights?: string;
};

export type SiteContent = {
  hero: HeroContent;
  stats: StatItem[];
  breedsSection: BreedsSection;
  whySection: WhySection;
  championsSection: ChampionsSection;
  testimonialsSection: TestimonialsSection;
  ctaSection: CtaSectionContent;
  about: AboutContent;
  footer: FooterContent;
};

export async function getSiteContent(locale?: string): Promise<SiteContent> {
  try {
    const r = await api.get('/site-content', { params: locale ? { locale } : {} });
    return r.data as SiteContent;
  } catch {
    return {
      hero: {},
      stats: [],
      breedsSection: {},
      whySection: {},
      championsSection: {},
      testimonialsSection: {},
      ctaSection: {},
      about: {},
      footer: {},
    };
  }
}
