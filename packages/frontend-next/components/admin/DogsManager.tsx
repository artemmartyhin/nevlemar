'use client';

import { useEffect, useState } from 'react';
import { api, Dog, uploadUrl } from '@/lib/api';
import SeoFields from './SeoFields';
import ImagePicker from './ImagePicker';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmDialog';

const empty = {
  _id: '',
  name: '',
  born: '',
  breed: 'pom',
  gender: 'true',
  description: '',
  mom: '',
  dad: '',
  metaTitle: '',
  metaDescription: '',
  imageUrl: '',
} as any;

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-nv-cream bg-white focus:outline-none focus:border-nv-dark focus:ring-2 focus:ring-nv-cream/50 transition';
const textareaCls = `${inputCls} min-h-[80px] resize-y`;

export default function DogsManager() {
  const toast = useToast();
  const confirm = useConfirm();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [breedFilter, setBreedFilter] = useState('');

  const load = async () => {
    try {
      const r = await api.get('/dogs');
      setDogs(r.data || []);
    } catch {
      toast.error('Не вдалося завантажити');
    }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: any = {
      name: form.name,
      born: form.born,
      breed: form.breed,
      gender: form.gender === 'true' || form.gender === true,
      description: form.description,
      mom: form.mom,
      dad: form.dad,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      imageUrl: form.imageUrl,
    };
    // drop empty strings
    Object.keys(payload).forEach((k) => (payload[k] === '' || payload[k] === undefined) && delete payload[k]);
    payload.gender = form.gender === 'true' || form.gender === true;

    try {
      if (editing) await api.patch(`/dogs/${editing}`, payload);
      else await api.post('/dogs', payload);
      toast.success(editing ? 'Собаку оновлено' : 'Собаку додано');
      setForm(empty); setEditing(null); setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message?.[0] || 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  const edit = (d: Dog) => {
    setEditing(d._id);
    setForm({
      ...d,
      gender: String(d.gender),
      born: d.born?.slice(0, 10),
      imageUrl: d.images?.[0] ? uploadUrl(d.images[0]) : '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async (d: Dog) => {
    if (!(await confirm({ title: 'Видалити собаку?', message: `«${d.name}» буде видалена.`, danger: true, confirmLabel: 'Видалити' }))) return;
    try {
      await api.delete(`/dogs/${d._id}`);
      toast.success('Видалено');
      load();
    } catch {
      toast.error('Помилка');
    }
  };

  const filtered = dogs.filter((d) => {
    if (breedFilter && d.breed !== breedFilter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-nv-cream/50">
        <div className="flex gap-2 flex-1">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Пошук..." className="px-4 py-2 rounded-full border border-nv-cream bg-white focus:outline-none focus:border-nv-dark min-w-[200px]" />
          <select value={breedFilter} onChange={(e) => setBreedFilter(e.target.value)} className="px-4 py-2 rounded-full border border-nv-cream bg-white focus:outline-none focus:border-nv-dark">
            <option value="">Усі породи</option>
            <option value="pom">Pomeranian</option>
            <option value="cvergsnaucer">Cvergsnaucer</option>
          </select>
        </div>
        <button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="rounded-full bg-nv-dark text-nv-cream font-semibold px-5 py-2 hover:bg-black transition">
          + Додати собаку
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white border border-nv-cream/60 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-nv-dark text-xl tracking-tight">
              {editing ? 'Редагувати собаку' : 'Нова собака'}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-nv-text hover:text-nv-dark">× Закрити</button>
          </div>

          <ImagePicker
            label="Фото"
            aspect="square"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Ім'я</label>
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Дата народження</label>
              <input type="date" className={inputCls} value={form.born} onChange={(e) => setForm({ ...form, born: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Порода</label>
              <select value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className={inputCls}>
                <option value="pom">Pomeranian</option>
                <option value="cvergsnaucer">Cvergsnaucer</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Стать</label>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputCls}>
                <option value="true">♂ Кобель</option>
                <option value="false">♀ Сука</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Мама</label>
              <input className={inputCls} value={form.mom} onChange={(e) => setForm({ ...form, mom: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Тато</label>
              <input className={inputCls} value={form.dad} onChange={(e) => setForm({ ...form, dad: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Опис</label>
            <textarea className={textareaCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>

          <SeoFields metaTitle={form.metaTitle || ''} metaDescription={form.metaDescription || ''} onChange={(v) => setForm({ ...form, ...v })} />

          <div className="flex gap-3 pt-4 border-t border-nv-cream/40">
            <button type="submit" disabled={saving} className="rounded-full bg-nv-dark text-nv-cream font-semibold px-6 py-2.5 hover:bg-black disabled:opacity-60">
              {saving ? 'Збереження...' : editing ? 'Оновити' : 'Додати'}
            </button>
            <button type="button" onClick={() => { setEditing(null); setForm(empty); setShowForm(false); }} className="rounded-full border border-nv-dark/20 px-6 py-2.5 font-semibold hover:bg-nv-cream/30">
              Скасувати
            </button>
          </div>
        </form>
      )}

      <div>
        <div className="text-xs uppercase tracking-wider text-nv-text font-semibold mb-3">
          Усі собаки · {filtered.length}
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-nv-text">Немає собак.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((d) => (
              <div key={d._id} className="group rounded-2xl bg-white border border-nv-cream/60 overflow-hidden hover:shadow-lg transition">
                <div className="aspect-square bg-nv-cream/30 relative">
                  <img src={uploadUrl(d.images?.[0])} alt={d.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-nv-dark/0 group-hover:bg-nv-dark/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => edit(d)} className="w-10 h-10 rounded-full bg-white text-nv-dark">✎</button>
                    <button onClick={() => del(d)} className="w-10 h-10 rounded-full bg-white text-rose-500">×</button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-display font-semibold text-nv-dark tracking-tight truncate">{d.name}</div>
                  <div className="text-[11px] uppercase tracking-wider text-nv-text">{d.breed} · {d.gender ? '♂' : '♀'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
