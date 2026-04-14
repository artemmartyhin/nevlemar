'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function LikeButton({ slug, initial }: { slug: string; initial: number }) {
  const [likes, setLikes] = useState(initial || 0);
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);

  const toggle = async () => {
    if (liked) return;
    setLiked(true);
    setLikes((n) => n + 1);
    setBurst((b) => b + 1);
    try {
      const r = await api.post(`/blog/${slug}/like`);
      if (typeof r.data?.likes === 'number') setLikes(r.data.likes);
    } catch {}
  };

  return (
    <button
      onClick={toggle}
      className="relative inline-flex items-center gap-2 rounded-full border border-nv-dark/20 px-4 py-2 hover:border-nv-dark transition group"
      aria-label="Like"
    >
      <motion.svg
        key={burst}
        initial={{ scale: 1 }}
        animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
        transition={{ duration: 0.5 }}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={liked ? '#e11d48' : 'none'}
        stroke={liked ? '#e11d48' : '#00172d'}
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </motion.svg>
      <span className="font-semibold text-nv-dark tabular-nums">{likes}</span>
      <AnimatePresence>
        {liked && (
          <motion.span
            key={`burst-${burst}`}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -30, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute left-1/2 -translate-x-1/2 -top-2 text-rose-500 pointer-events-none"
          >
            +1
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
