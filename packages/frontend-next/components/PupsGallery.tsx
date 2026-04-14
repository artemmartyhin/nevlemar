'use client';

import { useState } from 'react';
import Lightbox from './Lightbox';
import { uploadUrl } from '@/lib/api';

type PuppyRow = { name: string; born?: string; gender?: string; image?: string };

export default function PupsGallery({
  cover,
  puppies,
  breed,
  name,
  description,
  momText,
  dadText,
  t,
}: {
  cover?: string;
  puppies: PuppyRow[];
  breed: string;
  name?: string;
  description?: string;
  momText?: string;
  dadText?: string;
  t: { mom: string; dad: string; litter: string; male: string; female: string; born: string };
}) {
  // All puppies share the same birth date — pick the first non-empty one
  const birth = puppies.find((p) => p.born)?.born;
  // All images: cover first, then each puppy's image (only non-empty)
  const all: string[] = [];
  if (cover) all.push(cover);
  puppies.forEach((p) => p.image && all.push(p.image));

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = (url: string) => {
    const i = all.findIndex((u) => u === url);
    setIndex(i >= 0 ? i : 0);
    setOpen(true);
  };

  return (
    <>
      <div className="grid md:grid-cols-[7fr_5fr] gap-8 md:gap-12 mt-6 items-start">
        <button
          type="button"
          onClick={() => cover && openAt(cover)}
          disabled={!cover}
          className="group relative aspect-[4/5] bg-nv-cream/30 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl cursor-zoom-in disabled:cursor-default"
        >
          <img
            src={uploadUrl(cover)}
            alt={breed}
            className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
          />
          {cover && (
            <div className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur text-nv-dark flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7" />
                <line x1="11" y1="8" x2="11" y2="14" />
                <line x1="8" y1="11" x2="14" y2="11" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          )}
        </button>

        <div>
          {name ? (
            <>
              <h1 className="font-display font-bold text-nv-dark text-3xl md:text-4xl tracking-tight">
                {name}
              </h1>
              <div className="mt-1 text-nv-text uppercase text-xs tracking-[0.2em]">{breed}</div>
            </>
          ) : (
            <h1 className="font-display font-bold text-nv-dark text-4xl uppercase tracking-tight">
              {breed}
            </h1>
          )}
          <div className="mt-6 space-y-2 text-nv-dark">
            {birth && (
              <div>
                <span className="font-bold">{t.born}: </span>
                {new Date(birth).toLocaleDateString()}
              </div>
            )}
            {momText && (
              <div>
                <span className="font-bold">{t.mom}: </span>
                {momText}
              </div>
            )}
            {dadText && (
              <div>
                <span className="font-bold">{t.dad}: </span>
                {dadText}
              </div>
            )}
          </div>
          {description && <p className="mt-6 text-nv-text leading-7">{description}</p>}
        </div>
      </div>

      {puppies && puppies.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display font-semibold text-nv-dark text-2xl md:text-3xl tracking-tight mb-6">
            {t.litter}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {puppies.map((p, i) => (
              <button
                type="button"
                key={i}
                onClick={() => p.image && openAt(p.image)}
                className="group rounded-xl bg-white border border-nv-cream overflow-hidden hover:shadow-lg transition text-left"
              >
                <div className="aspect-square bg-nv-cream/20 relative">
                  <img src={uploadUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                  {p.image && (
                    <div className="absolute inset-0 bg-nv-dark/0 group-hover:bg-nv-dark/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <div className="w-10 h-10 rounded-full bg-white/90 text-nv-dark flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <circle cx="11" cy="11" r="7" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-display font-semibold text-nv-dark tracking-tight">{p.name}</div>
                  <div className="text-xs text-nv-text mt-1">
                    {p.born ? new Date(p.born).toLocaleDateString() : ''}
                    {p.gender && <> · {p.gender === 'female' ? `♀ ${t.female}` : `♂ ${t.male}`}</>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <Lightbox
        images={all}
        open={open}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setOpen(false)}
        alt={breed}
      />
    </>
  );
}
