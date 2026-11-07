import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsOptional, IsString, Length, MaxLength, ValidateIf } from 'class-validator';
import {
  CATEGORY_MAX_LENGTH,
  CATEGORY_MIN_LENGTH,
  EXCERPT_MAX_LENGTH,
  MAX_TAGS,
  TAG_MAX_LENGTH,
  TAG_MIN_LENGTH,
  THUMBNAIL_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from '../../internal/blog.constants';
import { IsCloudinaryUrl } from '../../internal/validation/cloudinary-url';
import { trim } from './create-blog.dto';

/**
 * PATCH /blogs/:id. Every field is optional; written out by hand (no @nestjs/swagger mapped types).
 * thumbnailUrl and excerpt accept null to clear them. title, category and tags cannot be null.
 */
export class UpdateBlogMetaDto {
  @ValidateIf((_, value) => value !== undefined)
  @Transform(trim)
  @IsString()
  @Length(TITLE_MIN_LENGTH, TITLE_MAX_LENGTH)
  title?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(EXCERPT_MAX_LENGTH)
  excerpt?: string | null;

  @IsOptional()
  @IsCloudinaryUrl()
  @MaxLength(THUMBNAIL_MAX_LENGTH)
  thumbnailUrl?: string | null;

  @ValidateIf((_, value) => value !== undefined)
  @Transform(trim)
  @IsString()
  @Length(CATEGORY_MIN_LENGTH, CATEGORY_MAX_LENGTH)
  category?: string;

  @ValidateIf((_, value) => value !== undefined)
  @IsArray()
  @ArrayMaxSize(MAX_TAGS)
  @IsString({ each: true })
  @Length(TAG_MIN_LENGTH, TAG_MAX_LENGTH, { each: true })
  tags?: string[];
}
