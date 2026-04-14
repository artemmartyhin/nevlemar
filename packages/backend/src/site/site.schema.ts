import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, minimize: false })
export class SiteContent extends mongoose.Document {
  @Prop({ default: 'default', unique: true, index: true })
  key: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  hero: any;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: [] })
  stats: any[];

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  breedsSection: any;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  whySection: any;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  championsSection: any;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  testimonialsSection: any;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  ctaSection: any;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  puppiesPage: any;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  about: any;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  footer: any;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  translations: any;
}

export const SiteContentSchema = SchemaFactory.createForClass(SiteContent);
