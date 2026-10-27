import { Transform } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsOptional, IsString, Length, Matches, MaxLength, ValidateIf } from 'class-validator';
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
import { SLUG_PATTERN } from './create-admin-blog.dto';

/**
 * PATCH /admin/blogs/:id. Metadata is not versioned, so on a live blog a change shows on the public page at once.
 * excerpt and thumbnailUrl accept null to clear them.
 */
export class UpdateAdminBlogMetaDto {
  @IsOptional() @Transform(trim) @IsString() @Length(TITLE_MIN_LENGTH, TITLE_MAX_LENGTH) title?: string;

  @IsOptional() @Transform(trim) @IsString() @MaxLength(SLUG_MAX_LENGTH)
  @Matches(SLUG_PATTERN, { message: 'slug must be lowercase letters, numbers and single hyphens' })
  slug?: string;

  @ValidateIf((_o, v) => v !== null) @IsOptional() @Transform(trim) @IsString() @MaxLength(EXCERPT_MAX_LENGTH)
  excerpt?: string | null;

  @ValidateIf((_o, v) => v !== null) @IsOptional() @IsCloudinaryUrl() @MaxLength(THUMBNAIL_MAX_LENGTH)
  thumbnailUrl?: string | null;

  @IsOptional() @Transform(trim) @IsString() @Length(CATEGORY_MIN_LENGTH, CATEGORY_MAX_LENGTH) category?: string;

  @IsOptional() @IsArray() @ArrayMaxSize(MAX_TAGS) @IsString({ each: true })
  @Length(TAG_MIN_LENGTH, TAG_MAX_LENGTH, { each: true })
  tags?: string[];
}
