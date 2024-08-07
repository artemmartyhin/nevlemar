import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

@Schema()
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
  description: string;

  @Prop()
  @IsNotEmpty()
  @IsBoolean()
  gender: boolean;

  @Prop()
  mom: string;

  @Prop()
  dad: string;

  @Prop()
  images: string[];
}

export const DogSchema = SchemaFactory.createForClass(Dog);
