
import { IsString, IsBoolean, IsOptional} from 'class-validator';

export class FindPuppiesDto {
  @IsString()
  @IsOptional()
  readonly breed?: string;

  @IsBoolean()
  @IsOptional()
  readonly gender?: boolean;
}