import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { CATEGORY_MAX_LENGTH, PAGE_SIZE_MAX, TAG_MAX_LENGTH } from '../../internal/blog.constants';
import { trim } from './create-blog.dto';

/** GET /public/blogs */
export class PublicListQueryDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  q?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(CATEGORY_MAX_LENGTH)
  category?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(TAG_MAX_LENGTH)
  tag?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGE_SIZE_MAX)
  limit?: number;
}
