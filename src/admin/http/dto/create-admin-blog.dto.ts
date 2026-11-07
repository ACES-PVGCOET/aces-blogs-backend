import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsObject, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';
import {
  CATEGORY_MAX_LENGTH,
  CATEGORY_MIN_LENGTH,
  EXCERPT_MAX_LENGTH,
  MAX_TAGS,
  SLUG_MAX_LENGTH,
  TAG_MAX_LENGTH,
  TAG_MIN_LENGTH,
  THUMBNAIL_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
} from '../../internal/admin.constants';
import { IsCloudinaryUrl } from '../../internal/validation/cloudinary-url';
import { trim } from './common';

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLUG_MESSAGE = 'slug must be lowercase letters, numbers and single hyphens';

/** POST /admin/blogs. The admin becomes the author. */
export class CreateAdminBlogDto {
  @Transform(trim) @IsString() @Length(TITLE_MIN_LENGTH, TITLE_MAX_LENGTH) title!: string;

  /** Optional: generated from the title when omitted. */
  @IsOptional() @Transform(trim) @IsString() @MaxLength(SLUG_MAX_LENGTH) @Matches(SLUG_PATTERN, { message: SLUG_MESSAGE })
  slug?: string;

  @IsOptional() @Transform(trim) @IsString() @MaxLength(EXCERPT_MAX_LENGTH) excerpt?: string;

  @IsOptional() @IsCloudinaryUrl() @MaxLength(THUMBNAIL_MAX_LENGTH) thumbnailUrl?: string;

  @Transform(trim) @IsString() @Length(CATEGORY_MIN_LENGTH, CATEGORY_MAX_LENGTH) category!: string;

  @IsOptional() @IsArray() @ArrayMaxSize(MAX_TAGS) @IsString({ each: true })
  @Length(TAG_MIN_LENGTH, TAG_MAX_LENGTH, { each: true })
  tags?: string[];

  /** TipTap JSON (editor.getJSON()). */
  @IsObject() content!: Record<string, unknown>;
}
