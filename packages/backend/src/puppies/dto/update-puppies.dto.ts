import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePuppiesDto {
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
}

export class UpdatePuppyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  born?: Date;

  @IsString()
  @IsOptional()
  gender?: string;
}