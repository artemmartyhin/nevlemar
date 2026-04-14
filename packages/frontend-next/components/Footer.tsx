import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/navigation';

export default function Footer() {
  const t = useTranslations('footer');
  return (
    <footer className="w-full bg-nv-dark text-nv-cream mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <Image src="/logo.png" alt="Nevlemar" width={220} height={55} className="object-contain invert brightness-0 opacity-90" />
          <p className="mt-4 text-sm leading-6 opacity-90">{t('tagline')}</p>
        </div>
        <div>
          <h3 className="font-display font-bold text-lg mb-3">{t('navigation')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/poms">{t('pomeranian')}</Link></li>
            <li><Link href="/cvergs">{t('cvergsnaucer')}</Link></li>
            <li><Link href="/puppies">{t('puppies')}</Link></li>
            <li><Link href="/blog">{t('blog')}</Link></li>
            <li><Link href="/aboutus">{t('about')}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display font-bold text-lg mb-3">{t('contacts')}</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="tel:+380501756050">+38 (050) 175-6050</a></li>
            <li><a href="mailto:nevlemar@gmail.com">nevlemar@gmail.com</a></li>
            <li><a href="https://www.facebook.com/nevlemar" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://www.instagram.com/nevlemar" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-nv-cream/20 py-4 text-center text-xs opacity-80">
        © {new Date().getFullYear()} Nevlemar Kennel. {t('rights')}
      </div>
    </footer>
  );
}
