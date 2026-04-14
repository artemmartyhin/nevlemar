import { IsNotEmpty, IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePuppyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  born: Date;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class CreatePuppiesDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePuppyDto)
  puppies: CreatePuppyDto[];

  @IsString()
  @IsOptional()
  mom?: string;

  @IsString()
  @IsOptional()
  dad?: string;

  @IsString()
  @IsNotEmpty()
  breed: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;
}
