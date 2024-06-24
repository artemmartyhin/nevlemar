import { IsDate, IsOptional, IsString, IsNotEmpty } from 'class-validator';
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

  @IsString()
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
}
