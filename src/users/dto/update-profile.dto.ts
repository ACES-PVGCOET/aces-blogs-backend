
import {
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  profileImg?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  linkedIn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
