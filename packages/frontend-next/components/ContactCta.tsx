'use client';

import { Link } from '@/navigation';
import { motion } from 'framer-motion';

export default function ContactCta({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  phone,
  email,
}: {
  title: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  phone?: string;
  email?: string;
}) {
  const isExternal = (h?: string) =>
    !!h && (h.startsWith('http') || h.startsWith('mailto:') || h.startsWith('tel:'));

  const Btn1 = isExternal(primaryHref) ? 'a' : Link;
  const Btn2 = isExternal(secondaryHref) ? 'a' : Link;

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 mt-28">
      <div className="relative overflow-hidden rounded-[28px] md:rounded-[40px] p-6 sm:p-8 md:p-16 text-center" style={{
        background: 'linear-gradient(135deg, #00172d 0%, #0a2540 55%, #00172d 100%)',
      }}>
        {/* Animated conic blob */}
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/2 w-[700px] h-[700px]"
          style={{
            background: 'conic-gradient(from 0deg, rgba(247,219,167,0.18), rgba(255,217,90,0.22), rgba(247,219,167,0.18))',
            borderRadius: '42%',
          }}
        />
        <div aria-hidden className="absolute -bottom-20 -left-20 w-[320px] h-[320px] rounded-full bg-nv-cream/8 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-nv-cream">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-semibold text-[26px] sm:text-[32px] md:text-[56px] leading-[1.05] tracking-[-0.035em]"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-base md:text-lg opacity-85"
            >
              {subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-wrap gap-3 justify-center"
          >
            {primaryLabel && (
              <Btn1
                href={(primaryHref || '/aboutus') as any}
                {...(isExternal(primaryHref) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group inline-flex items-center gap-2 rounded-full bg-nv-cream text-nv-dark font-semibold px-7 py-3.5 hover:scale-105 transition-transform shadow-xl"
              >
                {primaryLabel}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Btn1>
            )}
            {secondaryLabel && (
              <Btn2
                href={(secondaryHref || '/puppies') as any}
                {...(isExternal(secondaryHref) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex items-center gap-2 rounded-full border-2 border-nv-cream/40 text-nv-cream font-semibold px-7 py-3.5 hover:bg-nv-cream/10 transition"
              >
                {secondaryLabel}
              </Btn2>
            )}
          </motion.div>

          {(phone || email) && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 pt-8 border-t border-nv-cream/15 flex flex-wrap gap-x-8 gap-y-2 justify-center text-sm opacity-80"
            >
              {phone && (
                <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="hover:opacity-100 hover:underline">
                  📞 {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="hover:opacity-100 hover:underline">
                  ✉ {email}
                </a>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
