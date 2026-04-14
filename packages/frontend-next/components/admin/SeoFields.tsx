'use client';

import { useState } from 'react';

export default function SeoFields({
  metaTitle,
  metaDescription,
  onChange,
}: {
  metaTitle: string;
  metaDescription: string;
  onChange: (v: { metaTitle: string; metaDescription: string }) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-nv-cream bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 font-display font-bold text-nv-dark"
      >
        <span>⚙ SEO налаштування</span>
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="p-4 border-t border-nv-cream space-y-4">
          <div>
            <div className="flex justify-between text-xs text-nv-text mb-1">
              <label>Meta title</label>
              <span className={metaTitle.length > 60 ? 'text-rose-500' : ''}>{metaTitle.length}/60</span>
            </div>
            <input
              value={metaTitle}
              onChange={(e) => onChange({ metaTitle: e.target.value, metaDescription })}
              className="w-full px-3 py-2 border border-nv-cream rounded-lg focus:outline-none focus:border-nv-dark"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-nv-text mb-1">
              <label>Meta description</label>
              <span className={metaDescription.length > 160 ? 'text-rose-500' : ''}>{metaDescription.length}/160</span>
            </div>
            <textarea
              value={metaDescription}
              onChange={(e) => onChange({ metaTitle, metaDescription: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-nv-cream rounded-lg focus:outline-none focus:border-nv-dark"
            />
          </div>
          <div className="rounded-lg bg-nv-cream/20 p-4 border border-nv-cream">
            <div className="text-xs text-nv-text mb-1">Google preview</div>
            <div className="text-blue-700 text-lg truncate">{metaTitle || 'Your title here'}</div>
            <div className="text-green-700 text-sm">nevlemar.com</div>
            <div className="text-nv-text text-sm line-clamp-2 mt-1">
              {metaDescription || 'Meta description preview...'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
