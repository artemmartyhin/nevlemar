
import { IsString, IsBoolean, IsOptional} from 'class-validator';

export class FindDogDto {
  @IsString()
  @IsOptional()
  readonly breed?: string;

  @IsBoolean()
  @IsOptional()
  readonly gender?: boolean;
}