import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { BlogStatus } from '@prisma/client';
import { PAGE_SIZE_MAX } from '../../internal/blog.constants';
import { trim } from './create-blog.dto';

/** GET /blogs/mine */
export class ListMyBlogsQueryDto {
  /** Title search (case-insensitive, matches anywhere in the title). */
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(100)
  q?: string;

  /** Filter by blog status. Default: everything except DELETED. */
  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

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
