import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator';

@Schema({ timestamps: true })
export class Dog extends mongoose.Document {
  @Prop()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop()
  @IsNotEmpty()
  born: Date;

  @Prop()
  @IsNotEmpty()
  @IsString()
  breed: string;

  @Prop()
  @IsString()
  @IsOptional()
  description: string;

  @Prop()
  @IsNotEmpty()
  @IsBoolean()
  gender: boolean;

  @Prop()
  @IsOptional()
  mom: string;

  @Prop()
  @IsOptional()
  dad: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop()
  @IsOptional()
  metaTitle: string;

  @Prop()
  @IsOptional()
  metaDescription: string;
}

export const DogSchema = SchemaFactory.createForClass(Dog);
