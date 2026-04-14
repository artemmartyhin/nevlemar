'use client';

import { useEffect, useState } from 'react';
import { api, PuppiesLitter, uploadUrl } from '@/lib/api';
import SeoFields from './SeoFields';
import ImagePicker from './ImagePicker';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmDialog';

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-nv-cream bg-white focus:outline-none focus:border-nv-dark focus:ring-2 focus:ring-nv-cream/50 transition';
const textareaCls = `${inputCls} min-h-[80px] resize-y`;

type PuppyRow = { name: string; born: string; gender: string; imageUrl?: string };

const emptyForm = () => ({
  _id: '',
  breed: 'pom',
  mom: '',
  dad: '',
  description: '',
  metaTitle: '',
  metaDescription: '',
  imageUrl: '',
  puppies: [] as PuppyRow[],
});

export default function PuppiesManager() {
  const toast = useToast();
  const confirm = useConfirm();
  const [litters, setLitters] = useState<PuppiesLitter[]>([]);
  const [form, setForm] = useState<any>(emptyForm());
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const r = await api.get('/puppies');
      setLitters(r.data || []);
    } catch {
      toast.error('Не вдалося завантажити');
    }
  };
  useEffect(() => { load(); }, []);

  const addPuppy = () =>
    setForm({
      ...form,
      puppies: [...form.puppies, { name: '', born: new Date().toISOString().slice(0, 10), gender: 'male', imageUrl: '' }],
    });

  const updatePuppy = (i: number, patch: Partial<PuppyRow>) => {
    const p = [...form.puppies];
    p[i] = { ...p[i], ...patch };
    setForm({ ...form, puppies: p });
  };

  const removePuppy = (i: number) => setForm({ ...form, puppies: form.puppies.filter((_: any, idx: number) => idx !== i) });

  const edit = (l: PuppiesLitter) => {
    setEditing(l._id);
    setForm({
      _id: l._id,
      breed: l.breed,
      mom: l.mom || '',
      dad: l.dad || '',
      description: l.description || '',
      metaTitle: l.metaTitle || '',
      metaDescription: l.metaDescription || '',
      imageUrl: l.image ? uploadUrl(l.image) : '',
      puppies: (l.puppies || []).map((p) => ({
        name: p.name,
        born: (p as any).born?.slice ? (p as any).born.slice(0, 10) : new Date().toISOString().slice(0, 10),
        gender: p.gender || 'male',
        imageUrl: p.image ? uploadUrl(p.image) : '',
      })),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload: any = {
      breed: form.breed,
      mom: form.mom,
      dad: form.dad,
      description: form.description,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      imageUrl: form.imageUrl,
      puppies: form.puppies.map((p: PuppyRow) => ({
        name: p.name,
        born: p.born,
        gender: p.gender,
        imageUrl: p.imageUrl || '',
      })),
    };
    Object.keys(payload).forEach((k) => (payload[k] === '' || payload[k] === undefined) && delete payload[k]);
    if (!payload.puppies) payload.puppies = [];

    try {
      if (editing) await api.patch(`/puppies/${editing}`, payload);
      else await api.post('/puppies', payload);
      toast.success(editing ? 'Помет оновлено' : 'Помет додано');
      setForm(emptyForm());
      setEditing(null);
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message?.[0] || 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  const del = async (l: PuppiesLitter) => {
    if (!(await confirm({ title: 'Видалити помет?', message: `Помет ${l.breed} буде видалений.`, danger: true, confirmLabel: 'Видалити' }))) return;
    try {
      await api.delete(`/puppies/${l._id}`);
      toast.success('Видалено');
      load();
    } catch {
      toast.error('Помилка');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end pb-4 border-b border-nv-cream/50">
        <button onClick={() => { setEditing(null); setForm(emptyForm()); setShowForm(true); }} className="rounded-full bg-nv-dark text-nv-cream font-semibold px-5 py-2 hover:bg-black">
          + Новий помет
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white border border-nv-cream/60 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-nv-dark text-xl tracking-tight">
              {editing ? 'Редагувати помет' : 'Новий помет'}
            </h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-nv-text hover:text-nv-dark">× Закрити</button>
          </div>

          <ImagePicker
            label="Обкладинка помету"
            aspect="landscape"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
          />

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">Порода</label>
              <select value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} className={inputCls}>
                <option value="pom">Pomeranian</option>
                <option value="cvergsnaucer">Cvergsnaucer</option>
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

          <div className="rounded-2xl border border-nv-cream bg-nv-cream/5 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-display font-semibold text-nv-dark tracking-tight">Щенята ({form.puppies.length})</h4>
              <button type="button" onClick={addPuppy} className="text-sm rounded-full border border-nv-dark/20 px-3 py-1 hover:bg-nv-cream/30 font-medium">+ Додати</button>
            </div>
            {form.puppies.length === 0 && (
              <div className="text-center text-sm text-nv-text py-4">Поки немає щенят. Додай першого.</div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {form.puppies.map((p: PuppyRow, i: number) => (
                <div key={i} className="rounded-xl border border-nv-cream bg-white p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <strong className="text-sm font-display tracking-tight">Щеня #{i + 1}</strong>
                    <button type="button" onClick={() => removePuppy(i)} className="text-rose-500 text-sm hover:underline">Видалити</button>
                  </div>
                  <ImagePicker aspect="square" value={p.imageUrl} onChange={(url) => updatePuppy(i, { imageUrl: url })} />
                  <input placeholder="Ім'я" value={p.name} onChange={(e) => updatePuppy(i, { name: e.target.value })} className={inputCls} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={p.born} onChange={(e) => updatePuppy(i, { born: e.target.value })} className={inputCls} />
                    <select value={p.gender} onChange={(e) => updatePuppy(i, { gender: e.target.value })} className={inputCls}>
                      <option value="male">♂ Кобель</option>
                      <option value="female">♀ Сука</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <SeoFields metaTitle={form.metaTitle} metaDescription={form.metaDescription} onChange={(v) => setForm({ ...form, ...v })} />

          <div className="flex gap-3 pt-4 border-t border-nv-cream/40">
            <button type="submit" disabled={saving} className="rounded-full bg-nv-dark text-nv-cream font-semibold px-6 py-2.5 hover:bg-black disabled:opacity-60">
              {saving ? 'Збереження...' : editing ? 'Оновити' : 'Додати помет'}
            </button>
            <button type="button" onClick={() => { setEditing(null); setForm(emptyForm()); setShowForm(false); }} className="rounded-full border border-nv-dark/20 px-6 py-2.5 font-semibold hover:bg-nv-cream/30">
              Скасувати
            </button>
          </div>
        </form>
      )}

      <div>
        <div className="text-xs uppercase tracking-wider text-nv-text font-semibold mb-3">
          Усі помети · {litters.length}
        </div>
        {litters.length === 0 ? (
          <div className="text-center py-12 text-nv-text">Немає пометів.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {litters.map((l) => (
              <div key={l._id} className="group rounded-2xl bg-white border border-nv-cream/60 p-4 flex gap-4 hover:shadow-md transition">
                <img src={uploadUrl(l.image)} alt={l.breed} className="w-24 h-24 object-cover rounded-xl shrink-0 bg-nv-cream/30" />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-nv-dark uppercase tracking-tight">{l.breed}</div>
                  <div className="text-xs text-nv-text mt-1 truncate">♀ {l.mom} · ♂ {l.dad}</div>
                  <div className="text-xs text-nv-text">{l.puppies?.length || 0} щенят</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => edit(l)} className="text-xs rounded-full border border-nv-dark/20 px-3 py-1 hover:bg-nv-cream/30 font-medium">✎ Редагувати</button>
                    <button onClick={() => del(l)} className="text-xs rounded-full border border-rose-300 text-rose-500 px-3 py-1 hover:bg-rose-50">Видалити</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
