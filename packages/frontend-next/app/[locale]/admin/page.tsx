'use client';

import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';
import BlogManager from '@/components/admin/BlogManager';
import DogsManager from '@/components/admin/DogsManager';
import PuppiesManager from '@/components/admin/PuppiesManager';
import SiteContentManager from '@/components/admin/SiteContentManager';
import { ToastProvider } from '@/components/ui/Toast';
import { ConfirmProvider } from '@/components/ui/ConfirmDialog';

type Tab = 'site' | 'blog' | 'dogs' | 'puppies';

const TABS: Array<{ key: Tab; icon: React.ReactNode; label: string; description: string }> = [
  { key: 'site', icon: <IconHome />, label: 'Головна', description: 'Контент та секції' },
  { key: 'blog', icon: <IconBlog />, label: 'Блог', description: 'Статті та категорії' },
  { key: 'dogs', icon: <IconDog />, label: 'Собаки', description: 'Каталог собак' },
  { key: 'puppies', icon: <IconPaw />, label: 'Цуценята', description: 'Помети та малюки' },
];

export default function AdminPage() {
  return (
    <ToastProvider>
      <ConfirmProvider>
        <AdminInner />
      </ConfirmProvider>
    </ToastProvider>
  );
}

function AdminInner() {
  const t = useTranslations('admin');
  const { user, loading, login, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('site');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-nv-dark border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-sm w-full bg-white border border-nv-cream rounded-3xl p-10 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-nv-dark text-nv-cream flex items-center justify-center font-display font-bold text-2xl mx-auto">
            N
          </div>
          <h1 className="font-display font-semibold text-nv-dark text-2xl mt-5 tracking-tight">
            Nevlemar CMS
          </h1>
          <p className="mt-2 text-sm text-nv-text">{t('signInRequired')}</p>
          <button
            onClick={login}
            className="mt-6 w-full rounded-full bg-nv-dark text-nv-cream font-semibold py-3 hover:bg-black transition"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-sm w-full bg-white border border-nv-cream rounded-3xl p-10 text-center">
          <h1 className="font-display font-semibold text-nv-dark text-2xl">Access denied</h1>
          <p className="mt-3 text-nv-text">{t('accessDenied', { email: user.email })}</p>
        </div>
      </div>
    );
  }

  const current = TABS.find((T) => T.key === tab)!;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top bar (mobile) */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b border-nv-cream/60 px-4 py-3 flex items-center justify-between">
        <div className="font-display font-semibold text-nv-dark tracking-tight">Nevlemar CMS</div>
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="w-9 h-9 rounded-lg border border-nv-dark/15 flex items-center justify-center"
        >
          ☰
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? 'fixed inset-0 z-50' : 'hidden'} md:relative md:block md:w-72 shrink-0 md:min-h-screen bg-white border-r border-nv-cream/60`}
        >
          {sidebarOpen && <div className="md:hidden fixed inset-0 bg-nv-dark/50" onClick={() => setSidebarOpen(false)} />}
          <div className="relative md:sticky md:top-0 bg-white h-screen flex flex-col p-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-nv-dark text-nv-cream flex items-center justify-center font-display font-bold text-xl">
                N
              </div>
              <div>
                <div className="font-display font-semibold text-nv-dark text-lg tracking-tight leading-none">Nevlemar</div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-nv-text mt-1">Admin</div>
              </div>
            </div>

            {/* User */}
            <div className="mt-8 flex items-center gap-3 p-3 rounded-2xl bg-nv-cream/20 border border-nv-cream/50">
              {user.picture ? (
                <img src={user.picture} alt="" className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-nv-dark text-nv-cream flex items-center justify-center font-semibold">
                  {user.firstName?.charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-nv-dark text-sm truncate">{user.firstName} {user.lastName}</div>
                <div className="text-[11px] text-nv-text truncate">{user.email}</div>
              </div>
            </div>

            {/* Nav */}
            <nav className="mt-6 space-y-1 flex-1">
              {TABS.map((T) => (
                <button
                  key={T.key}
                  onClick={() => { setTab(T.key); setSidebarOpen(false); }}
                  className={`group w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition ${
                    tab === T.key
                      ? 'bg-nv-dark text-nv-cream'
                      : 'text-nv-dark hover:bg-nv-cream/30'
                  }`}
                >
                  <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    tab === T.key ? 'bg-nv-cream/15' : 'bg-nv-cream/40 group-hover:bg-nv-cream/60'
                  }`}>
                    {T.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{T.label}</div>
                    <div className={`text-[11px] ${tab === T.key ? 'text-nv-cream/70' : 'text-nv-text'} truncate`}>
                      {T.description}
                    </div>
                  </span>
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-nv-cream/40 flex flex-col gap-1 text-sm">
              <a href="/uk" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg text-nv-dark hover:bg-nv-cream/30 flex items-center justify-between">
                <span>Відкрити сайт</span>
                <span>↗</span>
              </a>
              <button onClick={logout} className="px-3 py-2 rounded-lg text-nv-dark hover:bg-nv-cream/30 flex items-center justify-between text-left">
                <span>Вийти</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 min-h-screen">
          {/* Page header */}
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-nv-cream/60 px-6 md:px-10 py-5">
            <div className="max-w-5xl">
              <div className="text-xs uppercase tracking-[0.2em] text-nv-text font-semibold">{current.description}</div>
              <h1 className="mt-1 font-display font-semibold text-nv-dark text-2xl md:text-3xl tracking-tight">
                {current.label}
              </h1>
            </div>
          </header>

          <div className="px-6 md:px-10 py-8 max-w-5xl">
            {tab === 'site' && <SiteContentManager />}
            {tab === 'blog' && <BlogManager />}
            {tab === 'dogs' && <DogsManager />}
            {tab === 'puppies' && <PuppiesManager />}
          </div>
        </main>
      </div>
    </div>
  );
}

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 12l9-9 9 9" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}
function IconBlog() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="14" y2="17" />
    </svg>
  );
}
function IconDog() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path d="M10 15c.5.5 1 1 2 1s1.5-.5 2-1" />
    </svg>
  );
}
function IconPaw() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="14" r="4" />
      <ellipse cx="5.5" cy="9" rx="2" ry="2.8" />
      <ellipse cx="18.5" cy="9" rx="2" ry="2.8" />
      <ellipse cx="9" cy="4.5" rx="1.8" ry="2.4" />
      <ellipse cx="15" cy="4.5" rx="1.8" ry="2.4" />
    </svg>
  );
}
