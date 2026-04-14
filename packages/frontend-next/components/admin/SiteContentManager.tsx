'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import ImagePicker from './ImagePicker';
import { useToast } from '@/components/ui/Toast';
import { useConfirm } from '@/components/ui/ConfirmDialog';
import type {
  SiteContent,
  HeroContent,
  StatItem,
  BreedsSection,
  WhySection,
  ChampionsSection,
  TestimonialsSection,
  CtaSectionContent,
  AboutContent,
  FooterContent,
  BreedCard,
} from '@/lib/siteContent';

type Status = 'idle' | 'saving' | 'saved' | 'error';

export default function SiteContentManager() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<string | null>('hero');
  const toast = useToast();
  const confirm = useConfirm();

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get('/site-content');
      setContent(r.data);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const saveSection = async (field: keyof SiteContent, value: any) => {
    await api.put('/site-content', { [field]: value });
    setContent((c) => (c ? { ...c, [field]: value } : c));
  };

  const resetAll = async () => {
    if (!(await confirm({ title: 'Скинути головну?', message: 'Усі зміни будуть втрачені. Дефолтний контент повернеться.', danger: true, confirmLabel: 'Скинути' }))) return;
    try {
      await api.post('/site-content/reset');
      toast.success('Контент скинуто до дефолту');
      load();
    } catch {
      toast.error('Не вдалося скинути');
    }
  };

  const retranslate = async () => {
    try {
      toast.info('Запуск фонового перекладу...');
      await api.post('/site-content/retranslate');
      toast.success('Переклад запущено');
    } catch {
      toast.error('Помилка перекладу');
    }
  };

  if (loading || !content) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-nv-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const SECTIONS = [
    { id: 'hero', icon: '◐', title: 'Hero', sub: 'Перший екран сайту' },
    { id: 'stats', icon: '▦', title: 'Stats', sub: 'Метрики-лічильники' },
    { id: 'breeds', icon: '❖', title: 'Breeds', sub: 'Породи' },
    { id: 'why', icon: '★', title: 'Why Nevlemar', sub: 'Наші переваги' },
    { id: 'champions', icon: '♛', title: 'Champions', sub: 'Зала слави' },
    { id: 'testimonials', icon: '❝', title: 'Testimonials', sub: 'Відгуки' },
    { id: 'cta', icon: '→', title: 'CTA', sub: 'Фінальний блок' },
    { id: 'about', icon: 'ℹ', title: 'About', sub: 'Про нас' },
    { id: 'footer', icon: '▁', title: 'Footer', sub: 'Підвал' },
  ];

  const render = (id: string) => {
    switch (id) {
      case 'hero': return <HeroEditor value={content.hero || {}} onSave={(v) => saveSection('hero', v)} onToast={toast} />;
      case 'stats': return <StatsEditor value={content.stats || []} onSave={(v) => saveSection('stats', v)} onToast={toast} />;
      case 'breeds': return <BreedsEditor value={content.breedsSection || {}} onSave={(v) => saveSection('breedsSection', v)} onToast={toast} />;
      case 'why': return <WhyEditor value={content.whySection || {}} onSave={(v) => saveSection('whySection', v)} onToast={toast} />;
      case 'champions': return <ChampionsEditor value={content.championsSection || {}} onSave={(v) => saveSection('championsSection', v)} onToast={toast} />;
      case 'testimonials': return <TestimonialsEditor value={content.testimonialsSection || {}} onSave={(v) => saveSection('testimonialsSection', v)} onToast={toast} />;
      case 'cta': return <CtaEditor value={content.ctaSection || {}} onSave={(v) => saveSection('ctaSection', v)} onToast={toast} />;
      case 'about': return <AboutEditor value={content.about || {}} onSave={(v) => saveSection('about', v)} onToast={toast} />;
      case 'footer': return <FooterEditor value={content.footer || {}} onSave={(v) => saveSection('footer', v)} onToast={toast} />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Action bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-nv-cream/50">
        <p className="text-sm text-nv-text">Редагуй будь-яку секцію — зміни летять миттєво. Переклад на 7 мов запуститься у фоні автоматично.</p>
        <div className="flex gap-2">
          <button onClick={retranslate} className="text-sm rounded-full border border-nv-dark/20 px-4 py-2 hover:bg-nv-cream/30 font-medium">
            ⟳ Перекласти все
          </button>
          <button onClick={resetAll} className="text-sm rounded-full border border-rose-500/30 text-rose-500 px-4 py-2 hover:bg-rose-50 font-medium">
            ↺ Скинути
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {SECTIONS.map((s) => {
          const open = openSection === s.id;
          return (
            <div key={s.id} className="rounded-2xl bg-white border border-nv-cream/60 overflow-hidden transition-shadow hover:shadow-sm">
              <button
                onClick={() => setOpenSection(open ? null : s.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-nv-cream/10 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-nv-cream/40 text-nv-dark flex items-center justify-center text-xl">
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-semibold text-nv-dark text-lg tracking-tight">{s.title}</div>
                  <div className="text-xs text-nv-text">{s.sub}</div>
                </div>
                <div className={`w-8 h-8 rounded-full border border-nv-dark/10 flex items-center justify-center transition-transform ${open ? 'rotate-45 bg-nv-dark text-nv-cream' : 'text-nv-dark'}`}>
                  +
                </div>
              </button>
              {open && <div className="px-5 pb-6 pt-2 border-t border-nv-cream/40 space-y-4 bg-white">{render(s.id)}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- shared helpers ---------------- */

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-nv-text mb-1.5 font-semibold">{label}</label>
      {children}
      {hint && <div className="text-[11px] text-nv-text/70 mt-1">{hint}</div>}
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-nv-cream bg-white focus:outline-none focus:border-nv-dark focus:ring-2 focus:ring-nv-cream/50 transition';
const textareaCls = `${inputCls} min-h-[90px] resize-y`;

function SaveRow({ onSave, status }: { onSave: () => void; status: Status }) {
  const label =
    status === 'saving' ? (
      <span className="flex items-center gap-2">
        <span className="w-3 h-3 border-2 border-nv-cream border-t-transparent rounded-full animate-spin" /> Збереження
      </span>
    ) : status === 'saved' ? (
      '✓ Збережено'
    ) : status === 'error' ? (
      'Помилка'
    ) : (
      'Зберегти'
    );
  return (
    <div className="flex items-center gap-3 pt-4 mt-2 border-t border-nv-cream/40">
      <button
        onClick={onSave}
        disabled={status === 'saving'}
        className={`rounded-full font-semibold px-6 py-2.5 transition ${
          status === 'saved' ? 'bg-emerald-500 text-white' : 'bg-nv-dark text-nv-cream hover:bg-black'
        } disabled:opacity-60`}
      >
        {label}
      </button>
    </div>
  );
}

function useSaver<T>(value: T, onSave: (v: T) => Promise<void>, onToast: ReturnType<typeof useToast>) {
  const [local, setLocal] = useState<T>(value);
  const [status, setStatus] = useState<Status>('idle');
  useEffect(() => setLocal(value), [value]);
  const save = async () => {
    try {
      setStatus('saving');
      await onSave(local);
      setStatus('saved');
      onToast.success('Збережено');
      setTimeout(() => setStatus('idle'), 1500);
    } catch {
      setStatus('error');
      onToast.error('Помилка збереження');
    }
  };
  return { local, setLocal, status, save };
}

type SaverProps<T> = { value: T; onSave: (v: T) => Promise<void>; onToast: ReturnType<typeof useToast> };

/* ---------------- editors ---------------- */

function HeroEditor({ value, onSave, onToast }: SaverProps<HeroContent>) {
  const { local, setLocal, status, save } = useSaver(value, onSave, onToast);
  const ms = local.miniStats || [];
  return (
    <>
      <Field label="Badge"><input className={inputCls} value={local.badge || ''} onChange={(e) => setLocal({ ...local, badge: e.target.value })} /></Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Title"><input className={inputCls} value={local.title || ''} onChange={(e) => setLocal({ ...local, title: e.target.value })} /></Field>
        <Field label="Subtitle"><input className={inputCls} value={local.sub || ''} onChange={(e) => setLocal({ ...local, sub: e.target.value })} /></Field>
      </div>
      <Field label="Tagline"><textarea className={textareaCls} value={local.tagline || ''} onChange={(e) => setLocal({ ...local, tagline: e.target.value })} /></Field>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Primary CTA — текст"><input className={inputCls} value={local.ctaPrimaryLabel || ''} onChange={(e) => setLocal({ ...local, ctaPrimaryLabel: e.target.value })} /></Field>
        <Field label="Primary CTA — посилання" hint="/puppies або https://..."><input className={inputCls} value={local.ctaPrimaryHref || ''} onChange={(e) => setLocal({ ...local, ctaPrimaryHref: e.target.value })} /></Field>
        <Field label="Secondary CTA — текст"><input className={inputCls} value={local.ctaSecondaryLabel || ''} onChange={(e) => setLocal({ ...local, ctaSecondaryLabel: e.target.value })} /></Field>
        <Field label="Secondary CTA — посилання"><input className={inputCls} value={local.ctaSecondaryHref || ''} onChange={(e) => setLocal({ ...local, ctaSecondaryHref: e.target.value })} /></Field>
      </div>

      <ImagePicker
        label="Зображення собаки (Hero)"
        value={local.image}
        onChange={(url) => setLocal({ ...local, image: url })}
        aspect="portrait"
      />

      <div>
        <label className="block text-xs uppercase tracking-wider text-nv-text mb-2 font-semibold">Mini-stats</label>
        <div className="space-y-2">
          {ms.map((m, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <input className={inputCls} placeholder="20+" value={m.value} onChange={(e) => { const n = [...ms]; n[i] = { ...n[i], value: e.target.value }; setLocal({ ...local, miniStats: n }); }} />
              <input className={inputCls} placeholder="Років" value={m.label} onChange={(e) => { const n = [...ms]; n[i] = { ...n[i], label: e.target.value }; setLocal({ ...local, miniStats: n }); }} />
              <button type="button" onClick={() => setLocal({ ...local, miniStats: ms.filter((_, j) => j !== i) })} className="w-10 h-10 rounded-full hover:bg-rose-50 text-rose-500">×</button>
            </div>
          ))}
          <button type="button" onClick={() => setLocal({ ...local, miniStats: [...ms, { value: '', label: '' }] })} className="text-sm rounded-full border border-nv-dark/20 px-4 py-1.5 hover:bg-nv-cream/30 font-medium">
            + Додати
          </button>
        </div>
      </div>
      <SaveRow onSave={save} status={status} />
    </>
  );
}

function StatsEditor({ value, onSave, onToast }: SaverProps<StatItem[]>) {
  const { local, setLocal, status, save } = useSaver(value, onSave, onToast);
  return (
    <>
      <div className="space-y-2">
        {local.map((s, i) => (
          <div key={i} className="grid grid-cols-[80px_80px_1fr_auto] gap-2 items-center">
            <input type="number" className={inputCls} placeholder="20" value={s.value} onChange={(e) => { const n = [...local]; n[i] = { ...n[i], value: Number(e.target.value) }; setLocal(n); }} />
            <input className={inputCls} placeholder="+" value={s.suffix || ''} onChange={(e) => { const n = [...local]; n[i] = { ...n[i], suffix: e.target.value }; setLocal(n); }} />
            <input className={inputCls} placeholder="Років досвіду" value={s.label} onChange={(e) => { const n = [...local]; n[i] = { ...n[i], label: e.target.value }; setLocal(n); }} />
            <button onClick={() => setLocal(local.filter((_, j) => j !== i))} className="w-10 h-10 rounded-full hover:bg-rose-50 text-rose-500">×</button>
          </div>
        ))}
        <button onClick={() => setLocal([...local, { value: 0, suffix: '', label: '' }])} className="text-sm rounded-full border border-nv-dark/20 px-4 py-1.5 hover:bg-nv-cream/30 font-medium">
          + Додати метрику
        </button>
      </div>
      <SaveRow onSave={save} status={status} />
    </>
  );
}

function BreedsEditor({ value, onSave, onToast }: SaverProps<BreedsSection>) {
  const { local, setLocal, status, save } = useSaver(value, onSave, onToast);
  const cards = local.cards || [];
  const updateCard = (i: number, patch: Partial<BreedCard>) => {
    const n = [...cards];
    n[i] = { ...n[i], ...patch };
    setLocal({ ...local, cards: n });
  };
  return (
    <>
      <div className="grid md:grid-cols-3 gap-4">
        <Field label="Eyebrow"><input className={inputCls} value={local.eyebrow || ''} onChange={(e) => setLocal({ ...local, eyebrow: e.target.value })} /></Field>
        <Field label="Title"><input className={inputCls} value={local.title || ''} onChange={(e) => setLocal({ ...local, title: e.target.value })} /></Field>
        <Field label="Explore label"><input className={inputCls} value={local.exploreLabel || ''} onChange={(e) => setLocal({ ...local, exploreLabel: e.target.value })} /></Field>
      </div>
      <Field label="Subtitle"><textarea className={textareaCls} value={local.subtitle || ''} onChange={(e) => setLocal({ ...local, subtitle: e.target.value })} /></Field>
      <div className="grid md:grid-cols-2 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl border border-nv-cream bg-nv-cream/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <strong className="font-display text-nv-dark tracking-tight">Картка #{i + 1}</strong>
              <button onClick={() => setLocal({ ...local, cards: cards.filter((_, j) => j !== i) })} className="text-rose-500 text-sm hover:underline">Видалити</button>
            </div>
            <ImagePicker aspect="portrait" value={c.image} onChange={(url) => updateCard(i, { image: url })} />
            <Field label="Title"><input className={inputCls} value={c.title} onChange={(e) => updateCard(i, { title: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Slug"><input className={inputCls} value={c.slug} onChange={(e) => updateCard(i, { slug: e.target.value })} /></Field>
              <Field label="Href"><input className={inputCls} value={c.href} onChange={(e) => updateCard(i, { href: e.target.value })} /></Field>
            </div>
            <Field label="Description"><textarea className={textareaCls} value={c.description} onChange={(e) => updateCard(i, { description: e.target.value })} /></Field>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!c.dark} onChange={(e) => updateCard(i, { dark: e.target.checked })} />
              Темний фон картки
            </label>
          </div>
        ))}
      </div>
      <button onClick={() => setLocal({ ...local, cards: [...cards, { slug: '', title: '', description: '', href: '/', image: '/main.png', dark: false }] })} className="text-sm rounded-full border border-nv-dark/20 px-4 py-1.5 hover:bg-nv-cream/30 font-medium">
        + Додати породу
      </button>
      <SaveRow onSave={save} status={status} />
    </>
  );
}

function WhyEditor({ value, onSave, onToast }: SaverProps<WhySection>) {
  const { local, setLocal, status, save } = useSaver(value, onSave, onToast);
  const items = local.items || [];
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Eyebrow"><input className={inputCls} value={local.eyebrow || ''} onChange={(e) => setLocal({ ...local, eyebrow: e.target.value })} /></Field>
        <Field label="Title"><input className={inputCls} value={local.title || ''} onChange={(e) => setLocal({ ...local, title: e.target.value })} /></Field>
      </div>
      <Field label="Subtitle"><input className={inputCls} value={local.subtitle || ''} onChange={(e) => setLocal({ ...local, subtitle: e.target.value })} /></Field>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-[60px_1fr_2fr_auto] gap-2 items-center">
            <input className={inputCls} placeholder="★" value={it.icon} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], icon: e.target.value }; setLocal({ ...local, items: n }); }} />
            <input className={inputCls} placeholder="Title" value={it.title} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], title: e.target.value }; setLocal({ ...local, items: n }); }} />
            <input className={inputCls} placeholder="Text" value={it.text} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; setLocal({ ...local, items: n }); }} />
            <button onClick={() => setLocal({ ...local, items: items.filter((_, j) => j !== i) })} className="w-10 h-10 rounded-full hover:bg-rose-50 text-rose-500">×</button>
          </div>
        ))}
        <button onClick={() => setLocal({ ...local, items: [...items, { icon: '★', title: '', text: '' }] })} className="text-sm rounded-full border border-nv-dark/20 px-4 py-1.5 hover:bg-nv-cream/30 font-medium">
          + Додати перевагу
        </button>
      </div>
      <SaveRow onSave={save} status={status} />
    </>
  );
}

function ChampionsEditor({ value, onSave, onToast }: SaverProps<ChampionsSection>) {
  const { local, setLocal, status, save } = useSaver(value, onSave, onToast);
  const items = local.items || [];
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Eyebrow"><input className={inputCls} value={local.eyebrow || ''} onChange={(e) => setLocal({ ...local, eyebrow: e.target.value })} /></Field>
        <Field label="Title"><input className={inputCls} value={local.title || ''} onChange={(e) => setLocal({ ...local, title: e.target.value })} /></Field>
      </div>
      <Field label="Subtitle"><input className={inputCls} value={local.subtitle || ''} onChange={(e) => setLocal({ ...local, subtitle: e.target.value })} /></Field>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <input className={inputCls} placeholder="Nevlemar Aurora · BIS PUPPY" value={it} onChange={(e) => { const n = [...items]; n[i] = e.target.value; setLocal({ ...local, items: n }); }} />
            <button onClick={() => setLocal({ ...local, items: items.filter((_, j) => j !== i) })} className="w-10 h-10 rounded-full hover:bg-rose-50 text-rose-500">×</button>
          </div>
        ))}
        <button onClick={() => setLocal({ ...local, items: [...items, ''] })} className="text-sm rounded-full border border-nv-dark/20 px-4 py-1.5 hover:bg-nv-cream/30 font-medium">
          + Додати чемпіона
        </button>
      </div>
      <SaveRow onSave={save} status={status} />
    </>
  );
}

function TestimonialsEditor({ value, onSave, onToast }: SaverProps<TestimonialsSection>) {
  const { local, setLocal, status, save } = useSaver(value, onSave, onToast);
  const items = local.items || [];
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Eyebrow"><input className={inputCls} value={local.eyebrow || ''} onChange={(e) => setLocal({ ...local, eyebrow: e.target.value })} /></Field>
        <Field label="Title"><input className={inputCls} value={local.title || ''} onChange={(e) => setLocal({ ...local, title: e.target.value })} /></Field>
      </div>
      <Field label="Subtitle"><input className={inputCls} value={local.subtitle || ''} onChange={(e) => setLocal({ ...local, subtitle: e.target.value })} /></Field>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-nv-cream bg-nv-cream/5 p-4 space-y-2">
            <div className="flex justify-between items-center">
              <strong className="text-nv-dark text-sm font-display tracking-tight">Відгук #{i + 1}</strong>
              <button onClick={() => setLocal({ ...local, items: items.filter((_, j) => j !== i) })} className="text-rose-500 text-sm hover:underline">Видалити</button>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              <input className={inputCls} placeholder="Ім'я" value={it.name} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], name: e.target.value }; setLocal({ ...local, items: n }); }} />
              <input className={inputCls} placeholder="Роль (Київ, Україна)" value={it.role} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], role: e.target.value }; setLocal({ ...local, items: n }); }} />
            </div>
            <textarea className={textareaCls} placeholder="Текст відгуку" value={it.text} onChange={(e) => { const n = [...items]; n[i] = { ...n[i], text: e.target.value }; setLocal({ ...local, items: n }); }} />
          </div>
        ))}
        <button onClick={() => setLocal({ ...local, items: [...items, { name: '', role: '', text: '' }] })} className="text-sm rounded-full border border-nv-dark/20 px-4 py-1.5 hover:bg-nv-cream/30 font-medium">
          + Додати відгук
        </button>
      </div>
      <SaveRow onSave={save} status={status} />
    </>
  );
}

function CtaEditor({ value, onSave, onToast }: SaverProps<CtaSectionContent>) {
  const { local, setLocal, status, save } = useSaver(value, onSave, onToast);
  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Eyebrow"><input className={inputCls} value={local.eyebrow || ''} onChange={(e) => setLocal({ ...local, eyebrow: e.target.value })} /></Field>
        <Field label="Title"><input className={inputCls} value={local.title || ''} onChange={(e) => setLocal({ ...local, title: e.target.value })} /></Field>
      </div>
      <Field label="Subtitle"><textarea className={textareaCls} value={local.subtitle || ''} onChange={(e) => setLocal({ ...local, subtitle: e.target.value })} /></Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Primary — текст"><input className={inputCls} value={local.primaryLabel || ''} onChange={(e) => setLocal({ ...local, primaryLabel: e.target.value })} /></Field>
        <Field label="Primary — href"><input className={inputCls} value={local.primaryHref || ''} onChange={(e) => setLocal({ ...local, primaryHref: e.target.value })} /></Field>
        <Field label="Secondary — текст"><input className={inputCls} value={local.secondaryLabel || ''} onChange={(e) => setLocal({ ...local, secondaryLabel: e.target.value })} /></Field>
        <Field label="Secondary — href"><input className={inputCls} value={local.secondaryHref || ''} onChange={(e) => setLocal({ ...local, secondaryHref: e.target.value })} /></Field>
      </div>
      <SaveRow onSave={save} status={status} />
    </>
  );
}

function AboutEditor({ value, onSave, onToast }: SaverProps<AboutContent>) {
  const { local, setLocal, status, save } = useSaver(value, onSave, onToast);
  return (
    <>
      <Field label="Title"><input className={inputCls} value={local.title || ''} onChange={(e) => setLocal({ ...local, title: e.target.value })} /></Field>
      <Field label="Intro"><textarea className={textareaCls} value={local.intro || ''} onChange={(e) => setLocal({ ...local, intro: e.target.value })} /></Field>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Phone"><input className={inputCls} value={local.phone || ''} onChange={(e) => setLocal({ ...local, phone: e.target.value })} /></Field>
        <Field label="Email"><input className={inputCls} value={local.email || ''} onChange={(e) => setLocal({ ...local, email: e.target.value })} /></Field>
        <Field label="Facebook URL"><input className={inputCls} value={local.facebook || ''} onChange={(e) => setLocal({ ...local, facebook: e.target.value })} /></Field>
        <Field label="Instagram URL"><input className={inputCls} value={local.instagram || ''} onChange={(e) => setLocal({ ...local, instagram: e.target.value })} /></Field>
      </div>
      <SaveRow onSave={save} status={status} />
    </>
  );
}

function FooterEditor({ value, onSave, onToast }: SaverProps<FooterContent>) {
  const { local, setLocal, status, save } = useSaver(value, onSave, onToast);
  return (
    <>
      <Field label="Tagline"><input className={inputCls} value={local.tagline || ''} onChange={(e) => setLocal({ ...local, tagline: e.target.value })} /></Field>
      <Field label="Rights"><input className={inputCls} value={local.rights || ''} onChange={(e) => setLocal({ ...local, rights: e.target.value })} /></Field>
      <SaveRow onSave={save} status={status} />
    </>
  );
}
