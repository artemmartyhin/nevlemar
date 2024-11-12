import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

@Schema()
export class Banner extends mongoose.Document {
  @Prop()
  @IsNotEmpty()
  @IsString()
  topic: string;

  @Prop()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Prop()
  @IsNotEmpty()
  @IsString()
  url: string;
  
  @Prop()
  image: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
