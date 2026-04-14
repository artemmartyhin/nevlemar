import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePuppyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  born?: Date;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class UpdatePuppiesDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePuppyDto)
  puppies: UpdatePuppyDto[];

  @IsString()
  @IsOptional()
  mom?: string;

  @IsString()
  @IsOptional()
  dad?: string;

  @IsString()
  @IsOptional()
  breed?: string;

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
