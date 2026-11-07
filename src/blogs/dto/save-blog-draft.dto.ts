import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class SaveBlogContentDto {
  @IsInt()
  @Min(1)
  expectedVersion!: number;

  @IsObject()
  content!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  changeSummary?: string;
}