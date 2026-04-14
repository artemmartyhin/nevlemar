'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { api, BlogCategory, BlogPost } from '@/lib/api';
import BlogCard from '@/components/blog/BlogCard';
import BlogHero from '@/components/blog/BlogHero';
import BlogFilters from '@/components/blog/BlogFilters';
import { motion } from 'framer-motion';

export default function BlogListPage() {
  const locale = useLocale();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [active, setActive] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog/categories', { params: { locale } }).then((r) => setCategories(r.data || [])).catch(() => {});
  }, [locale]);

  useEffect(() => {
    setLoading(true);
    const q: any = { locale };
    if (active !== 'all') q.category = active;
    if (search) q.search = search;
    const t = setTimeout(() => {
      api
        .get('/blog', { params: q })
        .then((r) => setPosts(r.data?.items || []))
        .catch(() => setPosts([]))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [active, search, locale]);

  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p !== featured);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-nv-cream/40 blur-3xl" />
        <div aria-hidden className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-nv-yellow/20 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-12 pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="uppercase tracking-[0.25em] text-nv-text/70 text-sm">Nevlemar Journal</div>
            <h1 className="font-display font-bold text-nv-dark text-[48px] md:text-[72px] leading-none mt-2">
              Блог
            </h1>
            <p className="mt-3 text-nv-text max-w-xl">
              Історії, поради та новини з нашого розплідника. Для всіх, хто любить собак так само, як і ми.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-10">
        {featured && !search && active === 'all' && (
          <div className="mb-10">
            <BlogHero post={featured} />
          </div>
        )}

        <BlogFilters
          categories={categories}
          active={active}
          onChange={setActive}
          search={search}
          onSearchChange={setSearch}
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[16/10] rounded-2xl bg-nv-cream/30 animate-pulse" />
              ))
            : rest.length === 0 && !featured
            ? <p className="col-span-full text-center text-nv-text py-12">Поки немає статей</p>
            : rest.map((p, i) => <BlogCard key={p._id} post={p} index={i} />)}
        </div>
      </section>

      <div className="h-24" />
    </div>
  );
}
