import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate, IsOptional, IsBoolean } from 'class-validator';

export class CreateDogDto {
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
  @IsNotEmpty()
  readonly gender: boolean;

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
}
