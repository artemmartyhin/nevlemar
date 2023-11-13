import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateDogDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsInt()
  readonly age: number;

  @IsString()
  @IsNotEmpty()
  readonly breed: string;

  @IsString()
  @IsNotEmpty()
  readonly gender: string;
}
