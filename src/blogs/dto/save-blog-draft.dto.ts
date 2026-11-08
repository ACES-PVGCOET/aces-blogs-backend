import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class SaveBlogContentDto {
  @ApiProperty({ example: 1, description: 'Version number author is editing (optimistic locking guard)' })
  @IsInt()
  @Min(1)
  expectedVersion!: number;

  @ApiProperty({
    example: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Updated draft content' }] }] },
    description: 'Updated TipTap JSON document',
  })
  @IsObject()
  content!: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'Added security best practices section', description: 'Brief revision note (max 500 chars)' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  changeSummary?: string;
}
