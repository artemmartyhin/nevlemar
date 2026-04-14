'use client';

import { Link } from '@/navigation';
import { BlogPost, uploadUrl } from '@/lib/api';
import { motion } from 'framer-motion';

export default function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
    >
      <Link
        href={`/blog/${post.slug}` as any}
        className="group block h-full rounded-2xl overflow-hidden bg-white border border-nv-cream/60 hover:border-nv-dark hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-nv-cream/30">
          <img
            src={post.coverImage?.includes('.') ? (post.coverImage.startsWith('/') || post.coverImage.startsWith('http') ? post.coverImage : `/${post.coverImage}`) : uploadUrl(post.coverImage)}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-xs font-semibold text-nv-dark uppercase tracking-wider">
            {post.category}
          </div>
          {post.featured && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-nv-yellow text-xs font-bold text-nv-dark">
              ★ Featured
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display font-bold text-nv-dark text-xl leading-tight group-hover:underline">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 text-nv-text text-sm leading-6 line-clamp-3">{post.excerpt}</p>
          )}
          <div className="mt-4 flex items-center justify-between text-xs text-nv-text">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-3">
              <span>📖 {post.readingTime || 3} хв</span>
              <span>👁 {post.views || 0}</span>
              <span>❤ {post.likes || 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
