import { Transform } from 'class-transformer';
import { IsString, IsInt, IsNotEmpty, IsDate } from 'class-validator';

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
  readonly gender: string;

  @Transform(({ value }) => value === 'true')
  @IsNotEmpty()
  readonly isPuppy: boolean;
}
