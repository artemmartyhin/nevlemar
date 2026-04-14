'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { uploadUrl } from '@/lib/api';

const slideVariants: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d >= 0 ? 80 : -80, scale: 0.96 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (d: number) => ({ opacity: 0, x: d >= 0 ? -80 : 80, scale: 0.96 }),
};

export default function Lightbox({
  images,
  open,
  index,
  onClose,
  onIndexChange,
  alt = '',
}: {
  images: string[];
  open: boolean;
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
  alt?: string;
}) {
  const [dir, setDir] = useState(0);

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    document.addEventListener('keydown', h);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', h);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, images.length]);

  const go = (delta: number) => {
    if (images.length <= 1) return;
    const next = (index + delta + images.length) % images.length;
    setDir(delta);
    onIndexChange(next);
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-nv-dark/92 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white text-2xl flex items-center justify-center backdrop-blur transition z-10"
            aria-label="Close"
          >
            ×
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 md:top-6 md:left-6 rounded-full bg-white/15 backdrop-blur text-white text-sm font-semibold px-4 py-2 z-10">
              {index + 1} / {images.length}
            </div>
          )}

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur text-white text-2xl flex items-center justify-center z-10 transition"
              aria-label="Previous"
            >
              ‹
            </button>
          )}

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur text-white text-2xl flex items-center justify-center z-10 transition"
              aria-label="Next"
            >
              ›
            </button>
          )}

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center p-6 md:p-16" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.img
                key={index}
                src={uploadUrl(images[index])}
                alt={alt}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                drag={images.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 || info.velocity.x < -300) go(1);
                  else if (info.offset.x > 60 || info.velocity.x > 300) go(-1);
                }}
                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing select-none"
                draggable={false}
              />
            </AnimatePresence>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur z-10 max-w-[90vw] overflow-x-auto">
              {images.map((src, j) => (
                <button
                  key={j}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDir(j > index ? 1 : -1);
                    onIndexChange(j);
                  }}
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                    j === index ? 'border-white' : 'border-white/20 hover:border-white/60'
                  }`}
                >
                  <img src={uploadUrl(src)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
