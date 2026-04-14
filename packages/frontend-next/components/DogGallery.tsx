'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { uploadUrl } from '@/lib/api';
import Lightbox from './Lightbox';

const variants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d >= 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: d >= 0 ? -60 : 60 }),
};

export default function DogGallery({ images, alt }: { images: string[]; alt: string }) {
  const imgs = images && images.length > 0 ? images : [''];
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const go = (next: number) => {
    const n = (next + imgs.length) % imgs.length;
    setDir(n > i || (i === imgs.length - 1 && n === 0) ? 1 : -1);
    setI(n);
  };

  return (
    <div className="select-none">
      <div className="relative aspect-[4/5] bg-nv-cream/30 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl group">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={i}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag={imgs.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 || info.velocity.x < -300) go(i + 1);
              else if (info.offset.x > 60 || info.velocity.x > 300) go(i - 1);
            }}
            className="absolute inset-0 touch-pan-y cursor-zoom-in active:cursor-grabbing"
            onClick={() => setLightboxOpen(true)}
          >
            <img src={uploadUrl(imgs[i])} alt={alt} className="w-full h-full object-cover pointer-events-none" draggable={false} />
          </motion.div>
        </AnimatePresence>

        {/* Zoom icon hint */}
        <div className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur text-nv-dark flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="7" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {imgs.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); go(i - 1); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur text-nv-dark flex items-center justify-center hover:bg-white shadow-lg transition z-10"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); go(i + 1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/85 backdrop-blur text-nv-dark flex items-center justify-center hover:bg-white shadow-lg transition z-10"
              aria-label="Next"
            >
              ›
            </button>
            <div className="absolute top-3 right-3 rounded-full bg-nv-dark/70 backdrop-blur text-nv-cream text-xs font-semibold px-3 py-1">
              {i + 1} / {imgs.length}
            </div>
          </>
        )}
      </div>

      {imgs.length > 1 && (
        <div className="mt-3 grid grid-cols-6 gap-2">
          {imgs.slice(0, 6).map((src, j) => (
            <button
              key={j}
              onClick={() => go(j)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                i === j ? 'border-nv-dark shadow-md' : 'border-nv-cream/60 hover:border-nv-dark/50'
              }`}
            >
              <img src={uploadUrl(src)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        images={imgs.filter((x) => !!x)}
        open={lightboxOpen}
        index={i}
        onIndexChange={setI}
        onClose={() => setLightboxOpen(false)}
        alt={alt}
      />
    </div>
  );
}
