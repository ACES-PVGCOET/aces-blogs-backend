import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Asha Sharma', description: 'Updated display name' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/test-cloud/image/upload/v1/avatar.png', description: 'Profile avatar URL' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  profileImg?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/ashasharma', description: 'LinkedIn profile URL' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  linkedIn?: string;

  @ApiPropertyOptional({ example: 'Senior Backend Engineer & Cloud Architect', description: 'Personal biography' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
