import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  readonly gender: boolean;

  @IsString()
  @IsOptional()
  readonly parents: string[];
}
