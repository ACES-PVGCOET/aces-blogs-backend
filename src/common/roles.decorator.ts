import { SetMetadata } from '@nestjs/common';
import { UserRole } from './enums';

export const ROLES_KEY = 'roles';
/** @Roles(UserRole.WRITER) = only these exact roles. Use together with JwtAuthGuard and RolesGuard. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
