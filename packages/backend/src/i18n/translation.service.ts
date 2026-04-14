import { Injectable, Logger } from '@nestjs/common';
// google-translate-api-x exports a CJS function; require keeps interop simple
// eslint-disable-next-line @typescript-eslint/no-var-requires
const translate: any = require('google-translate-api-x');

export const TARGET_LOCALES = ['en', 'de', 'it', 'pl', 'fr', 'es', 'cs'] as const;
export type TargetLocale = (typeof TARGET_LOCALES)[number];
export const SOURCE_LOCALE = 'uk';

// Heuristics: don't translate URLs, empty strings, icons, colors, css values
const SKIP_REGEX = /^(https?:|mailto:|tel:|\/|#|\$|%|[A-Fa-f0-9]{6}$)/;
const isSkippable = (s: string) => {
  const t = s.trim();
  if (!t) return true;
  if (t.length < 2) return true; // single char icons like ★, ♥
  if (SKIP_REGEX.test(t)) return true;
  // Numbers-only, hex colors, CSS values
  if (/^[\d\s+.,-]+$/.test(t)) return true;
  if (/^#[0-9a-f]{3,8}$/i.test(t)) return true;
  return false;
};

// Keys whose values should never be translated even if they look like text
const SKIP_KEYS = new Set([
  'slug', 'href', 'url', 'image', 'coverImage', 'icon',
  '_id', 'id', '__v', 'createdAt', 'updatedAt',
  'color', 'className', 'style',
  'phone', 'email', 'facebook', 'instagram', 'twitter',
  'ctaPrimaryHref', 'ctaSecondaryHref', 'primaryHref', 'secondaryHref',
]);

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  private queue: Array<() => Promise<void>> = [];
  private processing = false;

  /** Translate a single string. */
  async translateText(text: string, to: TargetLocale, from = SOURCE_LOCALE): Promise<string> {
    if (isSkippable(text)) return text;
    try {
      const res = await translate(text, { from, to, forceBatch: false });
      return (res?.text as string) || text;
    } catch (e: any) {
      this.logger.warn(`translate fail (${from}→${to}): ${e?.message || e}`);
      return text;
    }
  }

  /** Batch translate multiple strings — much faster with google-translate-api-x array support. */
  async translateBatch(texts: string[], to: TargetLocale, from = SOURCE_LOCALE): Promise<string[]> {
    if (texts.length === 0) return [];
    const toTranslate = texts.map((t) => (isSkippable(t) ? null : t));
    const pending = toTranslate.filter((t): t is string => t !== null);
    if (pending.length === 0) return texts;

    try {
      const res = await translate(pending, { from, to });
      const results: string[] = Array.isArray(res) ? res.map((r: any) => r?.text || '') : [(res as any)?.text || ''];
      const out: string[] = [];
      let ri = 0;
      for (let i = 0; i < texts.length; i++) {
        if (toTranslate[i] === null) out.push(texts[i]);
        else {
          out.push(results[ri] || texts[i]);
          ri++;
        }
      }
      return out;
    } catch (e: any) {
      this.logger.warn(`batch translate fail (${from}→${to}): ${e?.message || e}`);
      return texts;
    }
  }

  /**
   * Deep-translate an object. Collects all strings, batch-translates, writes back.
   * Preserves structure and skippable fields.
   */
  async translateObject<T>(obj: T, to: TargetLocale, from = SOURCE_LOCALE): Promise<T> {
    const paths: Array<{ path: (string | number)[]; value: string }> = [];

    const walk = (val: any, path: (string | number)[]) => {
      if (val === null || val === undefined) return;
      if (typeof val === 'string') {
        paths.push({ path, value: val });
        return;
      }
      if (Array.isArray(val)) {
        val.forEach((v, i) => walk(v, [...path, i]));
        return;
      }
      if (typeof val === 'object') {
        for (const k of Object.keys(val)) {
          if (SKIP_KEYS.has(k)) continue;
          walk(val[k], [...path, k]);
        }
      }
    };

    const cloned = JSON.parse(JSON.stringify(obj));
    walk(cloned, []);

    if (paths.length === 0) return cloned;

    // Batch translate all strings at once (google-translate-api-x supports arrays)
    const translated = await this.translateBatch(
      paths.map((p) => p.value),
      to,
      from,
    );

    paths.forEach((p, i) => {
      let node = cloned as any;
      for (let j = 0; j < p.path.length - 1; j++) node = node[p.path[j]];
      node[p.path[p.path.length - 1]] = translated[i];
    });

    return cloned;
  }

  /** Translate to all target locales, returns { en: ..., de: ..., ... }. */
  async translateToAll<T>(obj: T, from = SOURCE_LOCALE): Promise<Record<TargetLocale, T>> {
    const out: any = {};
    for (const locale of TARGET_LOCALES) {
      try {
        out[locale] = await this.translateObject(obj, locale, from);
      } catch (e: any) {
        this.logger.warn(`translateToAll ${locale} failed: ${e?.message}`);
        out[locale] = obj;
      }
      // small cooldown to avoid rate-limiting
      await new Promise((r) => setTimeout(r, 200));
    }
    return out;
  }

  /** Fire-and-forget queueing so API responses aren't blocked. */
  enqueue(task: () => Promise<void>) {
    this.queue.push(task);
    this.drain();
  }

  private async drain() {
    if (this.processing) return;
    this.processing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      try {
        await task();
      } catch (e: any) {
        this.logger.warn(`queue task failed: ${e?.message}`);
      }
    }
    this.processing = false;
  }
}
