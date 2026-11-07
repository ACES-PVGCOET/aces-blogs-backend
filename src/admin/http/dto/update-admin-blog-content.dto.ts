import { Type } from 'class-transformer';
import { IsInt, IsObject, Min } from 'class-validator';

export class UpdateAdminBlogContentDto {
  /** TipTap JSON (editor.getJSON()). */
  @IsObject() content!: Record<string, unknown>;

  /** The latestRevisionVersion the editor loaded. A different current version means someone else saved: 409. */
  @Type(() => Number) @IsInt() @Min(1) expectedVersion!: number;
}
