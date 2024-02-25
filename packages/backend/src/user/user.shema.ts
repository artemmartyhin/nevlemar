import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';

@Schema()
export class User extends mongoose.Document {
  @Prop()
  @IsNotEmpty()
  email: string;

  @Prop()
  @IsNotEmpty()
  firstName: string;

  @Prop()
  @IsNotEmpty()
  lastName: string;

  @Prop()
  @IsNotEmpty()
  picture: string;

  @Prop()
  @IsNotEmpty()
  accessToken: string;

  @Prop()
  @IsNotEmpty()
  role: 'user' | 'admin' | 'moderator';
}

export const UserSchema = SchemaFactory.createForClass(User);
