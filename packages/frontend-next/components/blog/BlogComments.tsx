'use client';

import { useEffect, useState } from 'react';
import { api, BlogComment } from '@/lib/api';
import useAuth from '@/hooks/useAuth';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

type Tree = BlogComment & { children: Tree[] };

export default function BlogComments({ postSlug }: { postSlug: string }) {
  const t = useTranslations('blog.comments');
  const { user, login } = useAuth();
  const [list, setList] = useState<BlogComment[]>([]);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const r = await api.get(`/blog/comments/${postSlug}`);
      setList(r.data || []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [postSlug]);

  const submit = async () => {
    if (!text.trim() || !user) return;
    try {
      await api.post('/blog/comments', {
        postSlug,
        authorName: `${user.firstName} ${user.lastName || ''}`.trim(),
        authorEmail: user.email,
        authorAvatar: user.picture,
        content: text.trim(),
        parentId: replyTo,
      });
      setText('');
      setReplyTo(null);
      load();
    } catch {}
  };

  const likeC = async (id: string) => {
    try {
      const r = await api.post(`/blog/comments/${id}/like`);
      setList((l) => l.map((c) => (String(c._id) === id ? { ...c, likes: r.data.likes } : c)));
    } catch {}
  };

  const tree: Tree[] = (() => {
    const map = new Map<string, Tree>();
    list.forEach((c) => map.set(String(c._id), { ...c, children: [] }));
    const roots: Tree[] = [];
    map.forEach((c) => {
      const pid = c.parentId ? String(c.parentId) : null;
      if (pid && map.has(pid)) map.get(pid)!.children.push(c);
      else roots.push(c);
    });
    return roots;
  })();

  const renderOne = (c: Tree, depth: number) => (
    <motion.div
      key={String(c._id)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-4 ${depth > 0 ? 'ml-6 md:ml-12 pl-4 border-l-2 border-nv-cream/60' : ''}`}
    >
      <div className="flex items-start gap-3">
        {c.authorAvatar ? (
          <img src={c.authorAvatar} alt={c.authorName} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-nv-cream flex items-center justify-center font-bold text-nv-dark">
            {c.authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-nv-dark">{c.authorName}</span>
            <span className="text-xs text-nv-text">{new Date(c.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="mt-1 text-nv-dark/90 leading-6">{c.content}</div>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <button onClick={() => likeC(String(c._id))} className="inline-flex items-center gap-1 text-nv-text hover:text-rose-500 transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{c.likes || 0}</span>
            </button>
            {user && (
              <button onClick={() => setReplyTo(String(c._id))} className="text-nv-text hover:text-nv-dark transition">
                ↩ Відповісти
              </button>
            )}
          </div>
        </div>
      </div>
      {c.children.map((ch) => renderOne(ch as Tree, depth + 1))}
    </motion.div>
  );

  return (
    <section className="mt-16 border-t border-nv-cream pt-10">
      <h2 className="font-display font-bold text-nv-dark text-2xl md:text-3xl">{t('title')}</h2>

      {user ? (
        <div className="mt-6 rounded-2xl bg-nv-cream/25 border border-nv-cream p-4">
          {replyTo && (
            <div className="mb-2 text-xs text-nv-text flex items-center gap-2">
              <span>Відповідь на коментар</span>
              <button onClick={() => setReplyTo(null)} className="underline">скасувати</button>
            </div>
          )}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('placeholder')}
            rows={3}
            className="w-full bg-white border border-nv-cream rounded-xl p-3 focus:outline-none focus:border-nv-dark font-display"
          />
          <div className="mt-3 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-nv-text">
              {user.picture && <img src={user.picture} alt="" className="w-6 h-6 rounded-full" />}
              <span>{user.firstName}</span>
            </div>
            <button
              onClick={submit}
              disabled={!text.trim()}
              className="rounded-full bg-nv-dark text-nv-cream px-5 py-2 font-semibold hover:bg-black disabled:opacity-40 transition"
            >
              {t('submit')}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-nv-cream/25 border border-nv-cream p-6 text-center">
          <p className="text-nv-text mb-4">{t('loginPrompt')}</p>
          <button onClick={login} className="inline-flex items-center gap-2 rounded-full bg-white border border-nv-dark px-5 py-2.5 font-semibold text-nv-dark hover:bg-nv-dark hover:text-nv-cream transition">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.07-.4-4.52H24v8.56h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.1c4.16-3.83 6.57-9.47 6.57-16.2z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.1-5.52c-1.97 1.32-4.49 2.1-7.46 2.1-5.73 0-10.59-3.87-12.32-9.07H4.34v5.7A22 22 0 0 0 24 46z"/><path fill="#FBBC05" d="M11.68 28.18A13.2 13.2 0 0 1 10.98 24c0-1.45.25-2.86.7-4.18v-5.7H4.34A22 22 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.34-5.7z"/><path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.42 3.29l6.31-6.31C34.92 2.87 29.94 1 24 1A22 22 0 0 0 4.34 14.12l7.34 5.7C13.41 13.62 18.27 9.75 24 9.75z"/></svg>
            {t('signInGoogle')}
          </button>
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <div className="text-nv-text">...</div>
        ) : tree.length === 0 ? (
          <p className="text-nv-text italic">{t('empty')}</p>
        ) : (
          <AnimatePresence>{tree.map((c) => renderOne(c, 0))}</AnimatePresence>
        )}
      </div>
    </section>
  );
}
