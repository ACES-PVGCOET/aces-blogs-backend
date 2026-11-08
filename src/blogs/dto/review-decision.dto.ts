import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ReviewActionDto {
  @ApiProperty({ example: 1, description: 'Version number being reviewed or approved' })
  @IsInt()
  @Min(1)
  expectedVersion!: number;

  @ApiPropertyOptional({
    example: 'Please elaborate on the authentication flow in section 2.',
    description: 'Reviewer feedback or revision note (max 3000 chars)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(3000)
  feedback?: string;
}
