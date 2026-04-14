import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogPost, BlogCategory, BlogComment } from './blog.schema';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
  CreateCategoryDto,
  CreateCommentDto,
} from './dto/create-blog-post.dto';
import { TranslationService, TARGET_LOCALES } from '../i18n/translation.service';

const TRANSLATABLE_POST_FIELDS = ['title', 'excerpt', 'content', 'metaTitle', 'metaDescription'] as const;
const TRANSLATABLE_CATEGORY_FIELDS = ['name', 'description'] as const;

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);

  constructor(
    @InjectModel('BlogPost') private readonly post: Model<BlogPost>,
    @InjectModel('BlogCategory') private readonly category: Model<BlogCategory>,
    @InjectModel('BlogComment') private readonly comment: Model<BlogComment>,
    private readonly translator: TranslationService,
  ) {}

  /** Overlay post with its translated fields for the given locale. */
  private overlay(post: any, locale?: string) {
    if (!post || !locale || locale === 'uk') return post;
    const t = post.translations?.[locale];
    if (!t) return post;
    const out: any = { ...(typeof post.toObject === 'function' ? post.toObject() : post) };
    for (const f of TRANSLATABLE_POST_FIELDS) {
      if (t[f]) out[f] = t[f];
    }
    return out;
  }

  // Posts
  async findAll(query: { category?: string; search?: string; limit?: number; skip?: number; featured?: string; locale?: string }) {
    const filter: any = { published: true };
    if (query.category && query.category !== 'all') filter.category = query.category;
    if (query.featured === 'true') filter.featured = true;
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { excerpt: { $regex: query.search, $options: 'i' } },
      ];
    }
    const limit = Number(query.limit) || 20;
    const skip = Number(query.skip) || 0;
    const [raw, total] = await Promise.all([
      this.post.find(filter).sort({ featured: -1, createdAt: -1 }).skip(skip).limit(limit).lean().exec(),
      this.post.countDocuments(filter),
    ]);
    const items = raw.map((p) => this.overlay(p, query.locale));
    return { items, total, limit, skip };
  }

  async findBySlug(slug: string, locale?: string) {
    const post = await this.post.findOne({ slug }).exec();
    if (!post) throw new NotFoundException('Post not found');
    post.views = (post.views || 0) + 1;
    await post.save();
    return this.overlay(post.toObject(), locale);
  }

  async related(slug: string, limit = 3, locale?: string) {
    const current = await this.post.findOne({ slug }).lean().exec();
    if (!current) return [];
    const items = await this.post
      .find({ slug: { $ne: slug }, category: (current as any).category, published: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
    return items.map((p) => this.overlay(p, locale));
  }

  async create(dto: CreateBlogPostDto) {
    if (!dto.readingTime) {
      const words = (dto.content || '').replace(/<[^>]*>/g, ' ').split(/\s+/).length;
      (dto as any).readingTime = Math.max(1, Math.round(words / 200));
    }
    const saved = await new this.post(dto).save();
    this.translator.enqueue(() => this.translatePost(saved._id as any));
    return saved;
  }

  async update(id: string, dto: UpdateBlogPostDto) {
    const updated = await this.post.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (updated) this.translator.enqueue(() => this.translatePost(id));
    return updated;
  }

  async delete(id: string) {
    return this.post.findByIdAndDelete(id).exec();
  }

  async like(slug: string) {
    const p = await this.post.findOneAndUpdate({ slug }, { $inc: { likes: 1 } }, { new: true }).exec();
    return { likes: p?.likes || 0 };
  }

  /** Translate all translatable fields of a post to all locales and save. */
  async translatePost(id: string) {
    const post = await this.post.findById(id).exec();
    if (!post) return;

    const source: any = {};
    for (const f of TRANSLATABLE_POST_FIELDS) source[f] = (post as any)[f] || '';

    const translations: any = { ...((post as any).translations || {}) };
    for (const loc of TARGET_LOCALES) {
      try {
        translations[loc] = await this.translator.translateObject(source, loc);
      } catch (e: any) {
        this.logger.warn(`translate post ${post.slug} → ${loc} failed: ${e?.message}`);
      }
      await new Promise((r) => setTimeout(r, 250));
    }
    (post as any).translations = translations;
    post.markModified('translations');
    await post.save();
    this.logger.log(`Translated post "${post.slug}" to ${TARGET_LOCALES.length} locales`);
  }

  /** Retranslate all posts (admin endpoint). */
  async retranslateAll() {
    const posts = await this.post.find({ published: true }).exec();
    for (const p of posts) {
      try {
        await this.translatePost(p._id as any);
      } catch {}
    }
    return { ok: true, count: posts.length };
  }

  // Categories
  async listCategories(locale?: string) {
    const cats = await this.category.find().sort({ order: 1, name: 1 }).lean().exec();
    if (!locale || locale === 'uk') return cats;
    return cats.map((c: any) => {
      const t = c.translations?.[locale];
      if (!t) return c;
      return { ...c, ...t };
    });
  }
  async createCategory(dto: CreateCategoryDto) {
    const saved = await new this.category(dto).save();
    this.translator.enqueue(() => this.translateCategory(saved._id as any));
    return saved;
  }

  async translateCategory(id: any) {
    const cat = await this.category.findById(id).exec();
    if (!cat) return;
    const source: any = { name: cat.name || '', description: cat.description || '' };
    const translations: any = { ...((cat as any).translations || {}) };
    for (const loc of TARGET_LOCALES) {
      try {
        translations[loc] = await this.translator.translateObject(source, loc);
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
    (cat as any).translations = translations;
    cat.markModified('translations');
    await cat.save();
    this.logger.log(`Translated category "${cat.slug}" to ${TARGET_LOCALES.length} locales`);
  }

  async retranslateCategories() {
    const cats = await this.category.find().exec();
    for (const c of cats) {
      try {
        await this.translateCategory(c._id as any);
      } catch {}
    }
    return { ok: true, count: cats.length };
  }
  async deleteCategory(id: string) {
    return this.category.findByIdAndDelete(id).exec();
  }

  // Comments
  async listComments(postSlug: string) {
    return this.comment.find({ postSlug, approved: true }).sort({ createdAt: 1 }).exec();
  }
  async createComment(dto: CreateCommentDto) {
    return new this.comment(dto).save();
  }
  async deleteComment(id: string) {
    return this.comment.findByIdAndDelete(id).exec();
  }
  async likeComment(id: string) {
    const c = await this.comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true }).exec();
    return { likes: c?.likes || 0 };
  }
}
