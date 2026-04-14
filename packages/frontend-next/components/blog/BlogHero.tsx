'use client';

import { Link } from '@/navigation';
import { BlogPost, uploadUrl } from '@/lib/api';
import { motion } from 'framer-motion';

export default function BlogHero({ post }: { post: BlogPost }) {
  const img = post.coverImage?.includes('.')
    ? post.coverImage.startsWith('/') || post.coverImage.startsWith('http')
      ? post.coverImage
      : `/${post.coverImage}`
    : uploadUrl(post.coverImage);

  return (
    <Link
      href={`/blog/${post.slug}` as any}
      className="block relative rounded-[24px] md:rounded-[28px] overflow-hidden bg-nv-dark group"
    >
      {/* Background image layer */}
      <div aria-hidden className="absolute inset-0">
        <img
          src={img}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:opacity-75 group-hover:scale-105 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nv-dark via-nv-dark/70 to-transparent" />
      </div>

      {/* Content — grows with its content, never clipped */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[560px] flex flex-col justify-end p-5 sm:p-8 md:p-12 text-nv-cream"
      >
        <div className="inline-flex self-start items-center gap-2 mb-3 md:mb-4 px-3 py-1 rounded-full bg-nv-yellow/90 text-nv-dark text-[10px] md:text-xs font-bold uppercase tracking-widest">
          ★ Featured · {post.category}
        </div>
        <h1 className="font-display font-bold text-[26px] sm:text-[36px] md:text-[56px] leading-[1.08] tracking-[-0.02em] max-w-3xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-2 md:mt-3 max-w-2xl opacity-90 text-sm md:text-lg leading-snug md:leading-normal line-clamp-2 md:line-clamp-none">
            {post.excerpt}
          </p>
        )}
        <div className="mt-3 md:mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 md:gap-5 text-[11px] md:text-sm opacity-90">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>📖 {post.readingTime || 3} хв</span>
          <span>👁 {post.views || 0}</span>
          <span className="underline group-hover:no-underline">Читати →</span>
        </div>
      </motion.div>
    </Link>
  );
}
