import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from './enums.js';
import { ROLES_KEY } from './roles.decorator.js';

interface AuthenticatedRequest {
  user?: {
    id?: string;
    sub?: string;
    role?: UserRole;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user?.role || !required.includes(request.user.role)) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
    return true;
  }
}
