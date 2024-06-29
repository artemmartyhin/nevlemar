import { IsNotEmpty, IsString, IsDate, IsArray } from 'class-validator';

export class CreatePuppiesDto {
  @IsArray()
  puppies: CreatePuppyDto[];

  @IsString()
  mom: string;

  @IsString()
  dad: string;

  @IsNotEmpty()
  @IsString()
  breed: string;
}


export class CreatePuppyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDate()
  born: Date;

  @IsString()
  gender: string;

  @IsString()
  image: string;
}
