import { IsString, IsOptional, IsBoolean, IsArray, IsNumber } from 'class-validator';

export class CreateBlogPostDto {
  @IsString() slug: string;
  @IsString() title: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsString() content: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsArray() images?: string[];
  @IsString() category: string;
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsString() author?: string;
  @IsOptional() @IsString() authorAvatar?: string;
  @IsOptional() @IsBoolean() published?: boolean;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsNumber() readingTime?: number;
  @IsOptional() @IsString() metaTitle?: string;
  @IsOptional() @IsString() metaDescription?: string;
}

export class UpdateBlogPostDto extends CreateBlogPostDto {}

export class CreateCategoryDto {
  @IsString() slug: string;
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsNumber() order?: number;
}

export class CreateCommentDto {
  @IsString() postSlug: string;
  @IsString() authorName: string;
  @IsOptional() @IsString() authorEmail?: string;
  @IsOptional() @IsString() authorAvatar?: string;
  @IsString() content: string;
  @IsOptional() parentId?: string | null;
}
