import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsObject, IsOptional, IsString, Length, MaxLength } from 'class-validator';
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

export const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

/** POST /blogs. The slug is generated from the title, so it is not accepted here. */
export class CreateBlogDto {
  @Transform(trim)
  @IsString()
  @Length(TITLE_MIN_LENGTH, TITLE_MAX_LENGTH)
  title!: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(EXCERPT_MAX_LENGTH)
  excerpt?: string;

  @IsOptional()
  @IsCloudinaryUrl()
  @MaxLength(THUMBNAIL_MAX_LENGTH)
  thumbnailUrl?: string;

  /** Required: blogs.category is NOT NULL. */
  @Transform(trim)
  @IsString()
  @Length(CATEGORY_MIN_LENGTH, CATEGORY_MAX_LENGTH)
  category!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_TAGS)
  @IsString({ each: true })
  @Length(TAG_MIN_LENGTH, TAG_MAX_LENGTH, { each: true })
  tags?: string[];

  /** TipTap JSON (editor.getJSON()). Omit to start with an empty document. */
  @IsOptional()
  @IsObject()
  content?: Record<string, unknown>;
}
