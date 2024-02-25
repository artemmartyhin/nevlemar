import { IsDateString, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDogDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsDateString()
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  readonly born?: Date;

  @IsString()
  @IsOptional()
  readonly breed?: string;

  @IsString()
  @IsOptional()
  readonly gender?: boolean
}
