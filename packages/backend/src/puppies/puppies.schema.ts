import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';

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

@Schema()
export class Puppies extends mongoose.Document {
  @Prop({ type: [{ type: Puppy }] })
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
  @IsNotEmpty()
  @IsString()
  image: string;
}

export const PuppySchema = SchemaFactory.createForClass(Puppy);
export const PuppiesSchema = SchemaFactory.createForClass(Puppies);
