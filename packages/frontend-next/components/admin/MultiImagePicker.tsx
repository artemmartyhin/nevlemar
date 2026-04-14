'use client';

import ImagePicker from './ImagePicker';

export default function MultiImagePicker({
  label,
  value,
  onChange,
  max = 10,
}: {
  label?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const list = value && value.length > 0 ? value : [''];

  const update = (i: number, url: string) => {
    const next = [...list];
    next[i] = url;
    onChange(next.filter((u) => !!u));
  };

  const remove = (i: number) => {
    const next = list.filter((_, j) => j !== i);
    onChange(next.filter((u) => !!u));
  };

  const move = (i: number, dir: -1 | 1) => {
    const next = [...list];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next.filter((u) => !!u));
  };

  const add = () => {
    if (list.length >= max) return;
    onChange([...list.filter((u) => !!u), '']);
  };

  return (
    <div>
      {label && (
        <div className="text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] normal-case tracking-normal text-nv-text/70 font-normal">
            Перше фото — головне
          </span>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {list.map((url, i) => (
          <div key={i} className="relative group">
            <ImagePicker
              aspect="square"
              value={url}
              onChange={(u) => update(i, u)}
            />
            {/* Index badge */}
            <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-nv-dark text-nv-cream flex items-center justify-center text-xs font-bold shadow-md">
              {i + 1}
              {i === 0 && <span className="absolute -bottom-1 -right-1 text-[8px]">★</span>}
            </div>
            {url && (
              <div className="absolute top-1 right-1 flex gap-1">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    className="w-7 h-7 rounded-full bg-white/90 text-nv-dark flex items-center justify-center text-sm shadow hover:bg-white"
                    aria-label="Move up"
                    title="Перемістити ліворуч"
                  >
                    ←
                  </button>
                )}
                {i < list.length - 1 && list[i + 1] && (
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    className="w-7 h-7 rounded-full bg-white/90 text-nv-dark flex items-center justify-center text-sm shadow hover:bg-white"
                    aria-label="Move down"
                    title="Перемістити праворуч"
                  >
                    →
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="w-7 h-7 rounded-full bg-white/90 text-rose-500 flex items-center justify-center text-sm shadow hover:bg-rose-500 hover:text-white"
                  aria-label="Delete"
                  title="Видалити фото"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ))}
        {list.length < max && (
          <button
            type="button"
            onClick={add}
            className="aspect-square rounded-xl border-2 border-dashed border-nv-cream hover:border-nv-dark bg-nv-cream/10 flex items-center justify-center text-nv-text hover:text-nv-dark transition"
          >
            <span className="text-center">
              <div className="text-3xl">+</div>
              <div className="text-xs mt-1 font-semibold">Додати фото</div>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
