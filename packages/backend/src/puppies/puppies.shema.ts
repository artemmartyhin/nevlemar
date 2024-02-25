import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

@Schema()
export class Puppies extends mongoose.Document {
  @Prop()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' })
  @IsNotEmpty()
  mother: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' })
  @IsNotEmpty()
  father: mongoose.Types.ObjectId;

  @Prop()
  @IsNotEmpty()
  breed: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' })
  @IsNotEmpty()
  puppies: [mongoose.Types.ObjectId];

  @Prop()
  @IsNotEmpty()
  @IsString()
  image: string;
}

export const PuppiesSchema = SchemaFactory.createForClass(Puppies);
