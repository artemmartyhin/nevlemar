import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateBannerDto {
  @IsString()
  @IsNotEmpty()
  readonly topic: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly url: string;
}
