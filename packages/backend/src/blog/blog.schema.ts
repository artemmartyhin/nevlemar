import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class BlogPost extends mongoose.Document {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  excerpt: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  coverImage: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ required: true, index: true })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 'Nevlemar' })
  author: string;

  @Prop()
  authorAvatar: string;

  @Prop({ default: true })
  published: boolean;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: 3 })
  readingTime: number;

  @Prop()
  metaTitle: string;

  @Prop()
  metaDescription: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  translations: any;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);

@Schema({ timestamps: true })
export class BlogCategory extends mongoose.Document {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  icon: string;

  @Prop({ default: '#f7dba7' })
  color: string;

  @Prop({ default: 0 })
  order: number;
}

export const BlogCategorySchema = SchemaFactory.createForClass(BlogCategory);

@Schema({ timestamps: true })
export class BlogComment extends mongoose.Document {
  @Prop({ required: true, index: true })
  postSlug: string;

  @Prop({ required: true })
  authorName: string;

  @Prop()
  authorEmail: string;

  @Prop()
  authorAvatar: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: true })
  approved: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BlogComment', default: null })
  parentId: mongoose.Types.ObjectId | null;

  @Prop({ default: 0 })
  likes: number;
}

export const BlogCommentSchema = SchemaFactory.createForClass(BlogComment);
