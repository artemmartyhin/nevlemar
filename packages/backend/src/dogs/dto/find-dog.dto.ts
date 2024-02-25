
import { IsString, IsBoolean, IsOptional} from 'class-validator';

export class FindDogDto {
  @IsString()
  @IsOptional()
  breed?: string;

  @IsBoolean()
  @IsOptional()
  gender?: boolean;
}