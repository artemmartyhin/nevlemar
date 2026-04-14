import { api, BlogPost } from '@/lib/api';
import { Link } from '@/navigation';
import BlogCard from '@/components/blog/BlogCard';

async function fetchLatest(locale?: string): Promise<BlogPost[]> {
  try {
    const r = await api.get('/blog', { params: { limit: 3, locale } });
    return r.data?.items || [];
  } catch {
    return [];
  }
}

export default async function BlogPreview({ locale }: { locale?: string }) {
  const posts = await fetchLatest(locale);
  if (posts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-nv-dark/60 font-bold">Journal</div>
          <h2 className="mt-2 font-display font-bold text-nv-dark text-4xl md:text-5xl">
            Історії з розплідника
          </h2>
        </div>
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 rounded-full border-2 border-nv-dark text-nv-dark font-semibold px-6 py-2.5 hover:bg-nv-dark hover:text-nv-cream transition"
        >
          Усі статті
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((p, i) => (
          <BlogCard key={p._id} post={p} index={i} />
        ))}
      </div>
    </section>
  );
}
