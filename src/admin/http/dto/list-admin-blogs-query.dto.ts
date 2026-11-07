import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { BlogStatus } from '@prisma/client';
import { CATEGORY_MAX_LENGTH, PAGE_SIZE_MAX } from '../../internal/admin.constants';
import { trim } from './common';

export class ListAdminBlogsQueryDto {
  /** Every status is allowed, DELETED included. */
  @IsOptional() @IsEnum(BlogStatus) status?: BlogStatus;
  @IsOptional() @Transform(trim) @IsString() @MaxLength(CATEGORY_MAX_LENGTH) category?: string;
  @IsOptional() @IsUUID() authorId?: string;
  @IsOptional() @IsUUID() reviewerId?: string;

  /** Title search, case-insensitive. */
  @IsOptional() @Transform(trim) @IsString() @MaxLength(200) q?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(PAGE_SIZE_MAX) limit?: number;
}
