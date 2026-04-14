import { api, BlogPost, uploadUrl } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import ReadingProgress from '@/components/blog/ReadingProgress';
import TableOfContents from '@/components/blog/TableOfContents';
import LikeButton from '@/components/blog/LikeButton';
import ShareButtons from '@/components/blog/ShareButtons';
import BlogComments from '@/components/blog/BlogComments';
import BlogCard from '@/components/blog/BlogCard';
import Breadcrumbs from '@/components/Breadcrumbs';

export const dynamic = 'force-dynamic';

async function fetchPost(slug: string, locale?: string): Promise<BlogPost | null> {
  try {
    const r = await api.get(`/blog/${slug}`, { params: { locale } });
    return r.data;
  } catch {
    return null;
  }
}

async function fetchRelated(slug: string, locale?: string): Promise<BlogPost[]> {
  try {
    const r = await api.get(`/blog/related/${slug}`, { params: { locale } });
    return r.data || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }) {
  const post = await fetchPost(params.slug, params.locale);
  return {
    title: post?.metaTitle || post?.title || 'Nevlemar Blog',
    description: post?.metaDescription || post?.excerpt || '',
  };
}

function resolveCover(cover?: string) {
  if (!cover) return '/main.png';
  if (cover.startsWith('http')) return cover;
  if (cover.startsWith('/')) return cover;
  if (cover.includes('.')) return `/${cover}`;
  return uploadUrl(cover);
}

export default async function BlogPostPage({ params: { slug, locale } }: { params: { slug: string; locale: string } }) {
  const post = await fetchPost(slug, locale);
  if (!post) notFound();
  const related = await fetchRelated(slug, locale);
  const cover = resolveCover(post.coverImage);

  return (
    <div>
      <ReadingProgress />

      {/* Parallax cover */}
      <section className="relative h-[56vh] md:h-[70vh] overflow-hidden bg-nv-dark">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 will-change-transform"
          style={{ backgroundImage: `url(${cover})`, filter: 'brightness(0.55)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nv-dark via-nv-dark/60 to-transparent" />
        <div className="relative h-full max-w-5xl mx-auto px-6 md:px-10 flex flex-col justify-end pb-12 md:pb-16 text-nv-cream">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Блог', href: '/blog' },
              { label: post.title },
            ]}
            variant="dark"
          />
          <div className="mt-4 flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-nv-yellow text-nv-dark text-xs font-bold uppercase tracking-widest">
              {post.category}
            </span>
            {post.featured && <span className="text-nv-yellow text-sm">★ Featured</span>}
          </div>
          <h1 className="font-display font-bold text-[36px] md:text-[64px] leading-[1.05] mt-4 max-w-4xl">
            {post.title}
          </h1>
          {post.excerpt && <p className="mt-4 text-lg opacity-90 max-w-2xl">{post.excerpt}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm opacity-90">
            <span className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-nv-cream text-nv-dark flex items-center justify-center font-bold">
                {post.author?.charAt(0) || 'N'}
              </div>
              {post.author || 'Nevlemar'}
            </span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>📖 {post.readingTime || 3} хв читання</span>
            <span>👁 {post.views || 0}</span>
          </div>
        </div>
      </section>

      {/* Article body with sticky TOC */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-12 md:py-16">
        <div className="grid lg:grid-cols-[1fr_260px] gap-12">
          <article>
            <div
              id="post-content"
              className="prose-nv text-nv-dark/90 text-lg leading-8 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-[1]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 flex items-center justify-between flex-wrap gap-4 border-t border-nv-cream pt-6">
              <LikeButton slug={post.slug} initial={post.likes || 0} />
              <ShareButtons title={post.title} />
            </div>

            {post.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-nv-cream/40 text-nv-dark text-sm font-semibold">
                    #{t}
                  </span>
                ))}
              </div>
            ) : null}

            <BlogComments postSlug={post.slug} />
          </article>

          <TableOfContents />
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
          <h2 className="font-display font-bold text-nv-dark text-2xl md:text-3xl mb-6">
            Схожі статті
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p, i) => (
              <BlogCard key={p._id} post={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
        <Link href="/blog" className="inline-block text-nv-dark font-display font-semibold underline">
          ← Повернутися до блогу
        </Link>
      </div>
    </div>
  );
}
