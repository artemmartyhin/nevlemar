'use client';

import { Link } from '@/navigation';
import { BlogPost, uploadUrl } from '@/lib/api';
import { motion } from 'framer-motion';

export default function BlogHero({ post }: { post: BlogPost }) {
  const img = post.coverImage?.includes('.') ? (post.coverImage.startsWith('/') || post.coverImage.startsWith('http') ? post.coverImage : `/${post.coverImage}`) : uploadUrl(post.coverImage);

  return (
    <Link
      href={`/blog/${post.slug}` as any}
      className="block relative rounded-[28px] overflow-hidden bg-nv-dark group"
    >
      <div className="relative aspect-[21/9] md:aspect-[21/8]">
        <img src={img} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-nv-dark via-nv-dark/70 to-transparent" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-x-0 bottom-0 p-6 md:p-12 text-nv-cream"
      >
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-nv-yellow/90 text-nv-dark text-xs font-bold uppercase tracking-widest">
          ★ Featured · {post.category}
        </div>
        <h1 className="font-display font-bold text-[32px] md:text-[56px] leading-tight max-w-3xl">
          {post.title}
        </h1>
        {post.excerpt && <p className="mt-3 max-w-2xl opacity-90 text-base md:text-lg">{post.excerpt}</p>}
        <div className="mt-5 flex items-center gap-5 text-sm opacity-90">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>📖 {post.readingTime || 3} хв</span>
          <span>👁 {post.views || 0}</span>
          <span className="underline group-hover:no-underline">Читати →</span>
        </div>
      </motion.div>
    </Link>
  );
}
