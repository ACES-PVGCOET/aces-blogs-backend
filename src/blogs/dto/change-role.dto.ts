import { IsEnum } from 'class-validator';
import { UserRole } from '../../generated/prisma/client.js';

export class ChangeRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}