import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';
import { PAGE_SIZE_MAX } from '../../internal/admin.constants';
import { trim } from './common';

export class ListUsersQueryDto {
  @IsOptional() @IsEnum(UserRole) role?: UserRole;
  @IsOptional() @IsEnum(UserStatus) status?: UserStatus;

  /** Matches name or email, case-insensitive. */
  @IsOptional() @Transform(trim) @IsString() @MaxLength(100) search?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(PAGE_SIZE_MAX) limit?: number;
}
