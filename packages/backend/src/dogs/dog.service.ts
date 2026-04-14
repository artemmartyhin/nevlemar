import { Injectable, Logger, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dog } from './dog.schema';
import { CreateDogDto } from './dto/create-dog.dto';
import { UpdateDogDto } from './dto/update-dog.dto';
import { FindDogDto } from './dto/find-dog.dto';
import { TranslationService, TARGET_LOCALES } from '../i18n/translation.service';

const TRANSLATABLE_FIELDS = ['description', 'metaTitle', 'metaDescription'] as const;

@Injectable()
export class DogService implements OnModuleInit {
  private readonly logger = new Logger(DogService.name);

  constructor(
    @InjectModel('Dog') private readonly dog: Model<Dog>,
    private readonly translator: TranslationService,
  ) {}

  async onModuleInit() {
    // Self-heal: find dogs with translatable fields but no translations yet,
    // and translate them in the background
    this.translator.enqueue(async () => {
      try {
        const dogs = await this.dog
          .find({
            $and: [
              { $or: [{ description: { $exists: true, $ne: '' } }, { metaTitle: { $ne: '' } }, { metaDescription: { $ne: '' } }] },
              { $or: [{ translations: { $exists: false } }, { translations: {} }, { translations: null }] },
            ],
          })
          .exec();
        for (const d of dogs) {
          try {
            await this.translateDog(d._id as any);
          } catch {}
        }
        if (dogs.length > 0) {
          this.logger.log(`Self-healed translations for ${dogs.length} dogs`);
        }
      } catch (e: any) {
        this.logger.warn(`Dog self-heal skipped: ${e?.message}`);
      }
    });
  }

  private overlay(dog: any, locale?: string) {
    if (!dog || !locale || locale === 'uk') return dog;
    const t = dog.translations?.[locale];
    if (!t) return dog;
    const out: any = { ...(typeof dog.toObject === 'function' ? dog.toObject() : dog) };
    for (const f of TRANSLATABLE_FIELDS) if (t[f]) out[f] = t[f];
    return out;
  }

  async findAll(locale?: string): Promise<Dog[]> {
    const raw = await this.dog.find().lean().exec();
    return raw.map((d: any) => this.overlay(d, locale));
  }

  async findByOptions(dto: FindDogDto, locale?: string): Promise<Dog[]> {
    const raw = await this.dog.find(dto as any).lean().exec();
    return raw.map((d: any) => this.overlay(d, locale));
  }

  async findOne(id: string, locale?: string): Promise<Dog> {
    const dog = await this.dog.findById(id).lean().exec();
    if (!dog) throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
    return this.overlay(dog, locale);
  }

  async create(dto: CreateDogDto): Promise<Dog> {
    const { imageUrl, imageUrls, ...rest } = dto as any;
    const newDog = new this.dog(rest);
    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      newDog.images = imageUrls.filter((u: string) => !!u);
    } else if (imageUrl) {
      newDog.images = [imageUrl];
    } else {
      newDog.images = [];
    }
    const saved = await newDog.save();
    this.translator.enqueue(() => this.translateDog(saved._id as any));
    return saved;
  }

  async update(id: string, dto: UpdateDogDto): Promise<Dog> {
    const dog = await this.dog.findById(id).exec();
    if (!dog) throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);

    const { imageUrl, imageUrls, ...rest } = dto as any;
    Object.keys(rest).forEach((k) => {
      if (rest[k] !== undefined) (dog as any)[k] = rest[k];
    });
    if (Array.isArray(imageUrls)) {
      dog.images = imageUrls.filter((u: string) => !!u);
      dog.markModified('images');
    } else if (imageUrl !== undefined) {
      if (!dog.images) dog.images = [];
      dog.images[0] = imageUrl;
      dog.markModified('images');
    }
    const saved = await dog.save();
    this.translator.enqueue(() => this.translateDog(id));
    return saved;
  }

  async delete(id: string): Promise<void> {
    const result = await this.dog.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) throw new HttpException('Dog not found', HttpStatus.NOT_FOUND);
  }

  async deleteSeveral(ids: string[]): Promise<void> {
    const result = await this.dog.deleteMany({ _id: { $in: ids } }).exec();
    if (result.deletedCount === 0) throw new HttpException('Dogs not found', HttpStatus.NOT_FOUND);
  }

  async translateDog(id: any) {
    const dog = await this.dog.findById(id).exec();
    if (!dog) return;
    const source: any = {};
    for (const f of TRANSLATABLE_FIELDS) source[f] = (dog as any)[f] || '';
    const translations: any = { ...((dog as any).translations || {}) };
    for (const loc of TARGET_LOCALES) {
      try {
        translations[loc] = await this.translator.translateObject(source, loc);
      } catch (e: any) {
        this.logger.warn(`dog ${dog.name} → ${loc} fail: ${e?.message}`);
      }
      await new Promise((r) => setTimeout(r, 200));
    }
    (dog as any).translations = translations;
    dog.markModified('translations');
    await dog.save();
    this.logger.log(`Translated dog "${dog.name}" to ${TARGET_LOCALES.length} locales`);
  }

  async retranslateAll() {
    const dogs = await this.dog.find().exec();
    for (const d of dogs) {
      try {
        await this.translateDog(d._id as any);
      } catch {}
    }
    return { ok: true, count: dogs.length };
  }
}
