import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator';

@Schema()
export class Puppy {
  @Prop()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop()
  image: string;

  @Prop()
  @IsNotEmpty()
  @IsDate()
  born: Date;

  @Prop()
  @IsString()
  gender: string;
}

export const PuppySchema = SchemaFactory.createForClass(Puppy);

@Schema({ timestamps: true })
export class Puppies extends mongoose.Document {
  @Prop({ type: [PuppySchema], default: [] })
  puppies: Puppy[];

  @Prop()
  mom: string;

  @Prop()
  dad: string;

  @Prop()
  @IsNotEmpty()
  @IsString()
  breed: string;

  @Prop()
  @IsString()
  description: string;

  @Prop()
  @IsOptional()
  @IsString()
  image: string;

  @Prop()
  @IsOptional()
  metaTitle: string;

  @Prop()
  @IsOptional()
  metaDescription: string;
}

export const PuppiesSchema = SchemaFactory.createForClass(Puppies);
