import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmptyObject, IsObject } from 'class-validator';

export class UpdateBlogContentDto {
  @ApiProperty({ description: 'TipTap JSON document content' })
  @IsDefined()
  @IsObject()
  @IsNotEmptyObject()
  content: Record<string, any>;
}
