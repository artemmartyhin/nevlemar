'use client';

import { useEffect, useState } from 'react';
import { api, BlogPost, BlogCategory } from '@/lib/api';
import RichEditor from './RichEditor';
import SeoFields from './SeoFields';
import ImagePicker from './ImagePicker';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmDialog';

const empty = {
  _id: '',
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: '',
  tags: '',
  featured: false,
  published: true,
  metaTitle: '',
  metaDescription: '',
};

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-nv-cream bg-white focus:outline-none focus:border-nv-dark focus:ring-2 focus:ring-nv-cream/50 transition';
const textareaCls = `${inputCls} min-h-[80px] resize-y`;

export default function BlogManager() {
  const toast = useToast();
  const confirm = useConfirm();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [cats, setCats] = useState<BlogCategory[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const [p, c] = await Promise.all([
        api.get('/blog', { params: { limit: 100 } }),
        api.get('/blog/categories'),
      ]);
      setPosts(p.data?.items || []);
      setCats(c.data || []);
    } catch {
      toast.error('Не вдалося завантажити дані');
    }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage,
      category: form.category || cats[0]?.slug,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : form.tags,
      featured: !!form.featured,
      published: !!form.published,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
    };
    try {
      if (editing) await api.put(`/blog/${editing}`, payload);
      else await api.post('/blog', payload);
      toast.success(editing ? 'Статтю оновлено' : 'Статтю опубліковано');
      setForm(empty);
      setEditing(null);
      setShowForm(false);
      load();
    } catch {
      toast.error('Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  const edit = (p: BlogPost) => {
    setEditing(p._id);
    setForm({ ...p, tags: (p.tags || []).join(', ') });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async (p: BlogPost) => {
    if (!(await confirm({ title: 'Видалити статтю?', message: `«${p.title}» буде видалена назавжди.`, danger: true, confirmLabel: 'Видалити' }))) return;
    try {
      await api.delete(`/blog/${p._id}`);
      toast.success('Статтю видалено');
      load();
    } catch {
      toast.error('Помилка видалення');
    }
  };

  const newPost = () => {
    setEditing(null);
    setForm(empty);
    setShowForm(true);
  };

  const retranslate = async () => {
    try {
      toast.info('Запуск фонового перекладу всіх постів...');
      await api.post('/blog/retranslate');
      toast.success('Переклад запущено');
    } catch {
      toast.error('Помилка');
    }
  };

  const filtered = posts.filter((p) => (search ? p.title.toLowerCase().includes(search.toLowerCase()) : true));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-nv-cream/50">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Пошук..."
          className="px-4 py-2 rounded-full border border-nv-cream bg-white focus:outline-none focus:border-nv-dark min-w-[220px]"
        />
        <div className="flex gap-2">
          <button onClick={retranslate} className="text-sm rounded-full border border-nv-dark/20 px-4 py-2 hover:bg-nv-cream/30 font-medium">
            ⟳ Перекласти
          </button>
          <button onClick={newPost} className="rounded-full bg-nv-dark text-nv-cream font-semibold px-5 py-2 hover:bg-black transition">
            + Нова стаття
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white border border-nv-cream/60 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-nv-dark text-xl tracking-tight">
              {editing ? 'Редагування статті' : 'Нова стаття'}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-nv-text hover:text-nv-dark">× Закрити</button>
          </div>

          <ImagePicker label="Обкладинка" aspect="landscape" value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Slug (URL)</label>
              <input className={inputCls} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Категорія</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                <option value="">— Обрати —</option>
                {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Заголовок</label>
            <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Excerpt (превью)</label>
            <textarea className={textareaCls} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Теги (через кому)</label>
            <input className={inputCls} value={typeof form.tags === 'string' ? form.tags : (form.tags || []).join(', ')} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Контент</label>
            <RichEditor value={form.content} onChange={(v) => setForm({ ...form, content: v })} />
          </div>

          <SeoFields
            metaTitle={form.metaTitle || ''}
            metaDescription={form.metaDescription || ''}
            onChange={(v) => setForm({ ...form, ...v })}
          />

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              <span className="font-medium">⭐ Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              <span className="font-medium">Published</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-nv-cream/40">
            <button type="submit" disabled={saving} className="rounded-full bg-nv-dark text-nv-cream font-semibold px-6 py-2.5 hover:bg-black disabled:opacity-60 transition">
              {saving ? 'Збереження...' : editing ? 'Оновити' : 'Опублікувати'}
            </button>
            <button type="button" onClick={() => { setEditing(null); setForm(empty); setShowForm(false); }} className="rounded-full border border-nv-dark/20 px-6 py-2.5 font-semibold hover:bg-nv-cream/30">
              Скасувати
            </button>
          </div>
        </form>
      )}

      <div>
        <div className="text-xs uppercase tracking-wider text-nv-text font-semibold mb-3">
          Усі статті · {filtered.length}
        </div>
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p._id} className="flex items-center gap-4 rounded-2xl bg-white border border-nv-cream/60 p-3 hover:shadow-md transition group">
              <div className="w-20 h-20 rounded-xl bg-nv-cream/30 overflow-hidden shrink-0">
                {p.coverImage && <img src={p.coverImage.startsWith('/') || p.coverImage.startsWith('http') ? p.coverImage : `/${p.coverImage}`} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-nv-text font-semibold">{p.category}</span>
                  {p.featured && <span className="text-[10px] bg-nv-yellow text-nv-dark rounded-full px-2 py-0.5 font-bold">★ Featured</span>}
                  {!p.published && <span className="text-[10px] bg-nv-text/20 text-nv-text rounded-full px-2 py-0.5 font-bold">Draft</span>}
                </div>
                <div className="font-display font-semibold text-nv-dark truncate tracking-tight">{p.title}</div>
                <div className="text-xs text-nv-text">{p.views || 0} views · {p.likes || 0} likes · {p.readingTime || 0} хв</div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button onClick={() => edit(p)} className="w-9 h-9 rounded-lg border border-nv-dark/20 hover:bg-nv-cream/30 text-nv-dark">✎</button>
                <button onClick={() => del(p)} className="w-9 h-9 rounded-lg border border-rose-300 text-rose-500 hover:bg-rose-50">×</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-nv-text">Немає статей. Натисни «+ Нова стаття».</div>
          )}
        </div>
      </div>
    </div>
  );
}
