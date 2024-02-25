import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreatePuppiesDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly mother: Types.ObjectId;

  @IsNotEmpty()
  readonly father: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  readonly breed: string;

  @IsArray()
  @IsNotEmpty()
  readonly puppies: Types.ObjectId[];

  @IsString()
  @IsNotEmpty()
  readonly image: string;
}
