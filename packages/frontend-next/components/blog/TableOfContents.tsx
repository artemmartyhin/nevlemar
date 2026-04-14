'use client';

import { useEffect, useState } from 'react';

type TocItem = { id: string; text: string; level: number };

export default function TableOfContents({ contentSelector = '#post-content' }: { contentSelector?: string }) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const root = document.querySelector(contentSelector);
    if (!root) return;
    const headings = root.querySelectorAll('h2, h3');
    const toc: TocItem[] = [];
    headings.forEach((h, i) => {
      const text = (h.textContent || '').trim();
      const id = h.id || `heading-${i}-${text.toLowerCase().replace(/[^a-zа-яіїєґё0-9]+/gi, '-').slice(0, 50)}`;
      h.id = id;
      toc.push({ id, text, level: h.tagName === 'H2' ? 2 : 3 });
    });
    setItems(toc);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-120px 0px -60% 0px' },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [contentSelector]);

  if (items.length < 2) return null;

  return (
    <aside className="sticky top-24 hidden lg:block">
      <div className="text-xs uppercase tracking-wider text-nv-text/70 mb-3">Зміст</div>
      <ul className="space-y-2 border-l-2 border-nv-cream/60 pl-4">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${it.id}`}
              className={`block text-sm transition ${
                active === it.id ? 'text-nv-dark font-semibold' : 'text-nv-text/80 hover:text-nv-dark'
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
