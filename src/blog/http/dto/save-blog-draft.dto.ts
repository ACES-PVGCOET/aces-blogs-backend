import { Transform } from 'class-transformer';
import { IsInt, IsObject, IsOptional, IsString, Length, Min } from 'class-validator';
import { TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from '../../internal/blog.constants';
import { trim } from './create-blog.dto';

/** PUT /blogs/:id/content */
export class SaveBlogContentDto {
  @IsObject()
  content!: Record<string, unknown>;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @Length(TITLE_MIN_LENGTH, TITLE_MAX_LENGTH)
  title?: string;

  /** Required lost-update guard: the version the editor loaded. */
  @IsInt()
  @Min(1)
  expectedVersion!: number;
}
