import { IsDate, IsOptional, IsString, IsNotEmpty, IsBoolean, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDogDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  readonly born: Date;

  @IsString()
  @IsNotEmpty()
  readonly breed: string;

  @Transform(({ value }) => value === true || value === 'true' || value === 1)
  @IsBoolean()
  @IsOptional()
  readonly gender?: boolean;

  @IsString()
  @IsOptional()
  readonly mom: string;

  @IsString()
  @IsOptional()
  readonly dad: string;

  @IsString()
  @IsOptional()
  readonly description: string;

  @IsString()
  @IsOptional()
  readonly metaTitle?: string;

  @IsString()
  @IsOptional()
  readonly metaDescription?: string;

  @IsString()
  @IsOptional()
  readonly imageUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly imageUrls?: string[];
}
