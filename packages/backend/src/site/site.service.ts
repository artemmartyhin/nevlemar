import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteContent } from './site.schema';
import { DEFAULT_SITE_CONTENT } from './site.defaults';
import { TranslationService, TARGET_LOCALES } from '../i18n/translation.service';

const TRANSLATABLE_SECTIONS = [
  'hero',
  'stats',
  'breedsSection',
  'whySection',
  'championsSection',
  'testimonialsSection',
  'ctaSection',
  'puppiesPage',
  'about',
  'footer',
];

@Injectable()
export class SiteService implements OnModuleInit {
  private readonly logger = new Logger(SiteService.name);

  constructor(
    @InjectModel('SiteContent') private readonly model: Model<SiteContent>,
    private readonly translator: TranslationService,
  ) {}

  async onModuleInit() {
    try {
      const existing = await this.model.findOne({ key: 'default' }).exec();
      if (!existing) {
        const doc = await new this.model({ key: 'default', ...DEFAULT_SITE_CONTENT }).save();
        this.logger.log('Seeded default site content');
        this.translator.enqueue(() => this.translateAll((doc as any)._id));
      }
    } catch (e: any) {
      this.logger.warn(`Site content seed skipped: ${e.message}`);
    }
  }

  /** Public read — optionally overlay a locale's translations. */
  async get(locale?: string) {
    let doc: any = await this.model.findOne({ key: 'default' }).lean().exec();
    if (!doc) {
      doc = (await new this.model({ key: 'default', ...DEFAULT_SITE_CONTENT }).save()).toObject();
    }
    if (!locale || locale === 'uk') return doc;
    const t = (doc as any).translations?.[locale];
    if (!t) return doc;
    const merged = { ...doc };
    for (const f of TRANSLATABLE_SECTIONS) {
      if (t[f] !== undefined) merged[f] = t[f];
    }
    return merged;
  }

  async update(patch: any) {
    let current = await this.model.findOne({ key: 'default' }).exec();
    if (!current) {
      current = await new this.model({ key: 'default', ...DEFAULT_SITE_CONTENT }).save();
    }
    const changedSections: string[] = [];
    TRANSLATABLE_SECTIONS.forEach((f) => {
      if (patch[f] !== undefined) {
        (current as any)[f] = patch[f];
        (current as any).markModified(f);
        changedSections.push(f);
      }
    });
    // Invalidate stale translations for changed sections — so /en/... falls back
    // to source text immediately instead of showing the previous English value
    // that no longer matches.
    if (changedSections.length > 0) {
      const translations: any = (current as any).translations || {};
      for (const loc of Object.keys(translations)) {
        for (const sec of changedSections) {
          if (translations[loc]?.[sec] !== undefined) delete translations[loc][sec];
        }
      }
      (current as any).translations = translations;
      (current as any).markModified('translations');
    }
    await current.save();
    // fire and forget background translation
    this.translator.enqueue(() => this.translateAll((current as any)._id));
    return current;
  }

  async reset() {
    await this.model.deleteOne({ key: 'default' }).exec();
    const fresh = await new this.model({ key: 'default', ...DEFAULT_SITE_CONTENT }).save();
    this.translator.enqueue(() => this.translateAll((fresh as any)._id));
    return fresh;
  }

  /** Re-run translation for all sections. */
  async retranslate() {
    const doc = await this.model.findOne({ key: 'default' }).exec();
    if (!doc) return { ok: false };
    await this.translateAll((doc as any)._id);
    return { ok: true };
  }

  /** Internal: translate all sections into all target locales and save. */
  async translateAll(id: any) {
    const doc = await this.model.findById(id).exec();
    if (!doc) return;

    const source: any = {};
    for (const f of TRANSLATABLE_SECTIONS) source[f] = (doc as any)[f];

    const translations: any = {};
    for (const loc of TARGET_LOCALES) {
      try {
        translations[loc] = await this.translator.translateObject(source, loc);
      } catch (e: any) {
        this.logger.warn(`translateAll ${loc} failed: ${e?.message}`);
      }
      await new Promise((r) => setTimeout(r, 200));
    }

    (doc as any).translations = translations;
    (doc as any).markModified('translations');
    await doc.save();
    this.logger.log(`Site content translated to ${TARGET_LOCALES.length} locales`);
  }
}
