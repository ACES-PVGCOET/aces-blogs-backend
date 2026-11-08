import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Artificial Intelligence', description: 'Category name (2-100 characters)' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;
}
