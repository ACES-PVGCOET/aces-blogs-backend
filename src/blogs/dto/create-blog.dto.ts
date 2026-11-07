import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ example: 'Building Scalable APIs with NestJS', description: 'Blog title (max 200 chars)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({
    example: 'building-scalable-apis-with-nestjs',
    description: 'Unique URL slug (lowercase alphanumeric with hyphens)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(220)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain lowercase letters, numbers, and hyphens only',
  })
  slug!: string;

  @ApiPropertyOptional({
    example: 'A deep dive into high-performance backend patterns with NestJS and PostgreSQL.',
    description: 'Brief blog excerpt (max 1000 chars)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  excerpt?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/test-cloud/image/upload/v1/thumbnail.png',
    description: 'Cloudinary image URL for blog thumbnail',
  })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  thumbnailUrl?: string;

  @ApiProperty({ example: 'Technology', description: 'Category name (max 100 chars)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category!: string;

  @ApiProperty({ example: ['nestjs', 'typescript', 'backend'], description: 'List of tags (max 20 tags)' })
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  tags!: string[];

  @ApiProperty({
    example: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello World' }] }] },
    description: 'TipTap JSON content structure',
  })
  @IsObject()
  content!: Record<string, unknown>;
}
