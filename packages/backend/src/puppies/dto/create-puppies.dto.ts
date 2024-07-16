import { IsNotEmpty, IsString, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { IsOptional } from 'class-validator';

export class CreatePuppiesDto {
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
}

export class CreatePuppyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  born: Date;

  @IsString()
  @IsOptional()
  gender?: string;
}
