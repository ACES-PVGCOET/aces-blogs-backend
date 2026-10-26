import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthenticatedUser, UserRole } from '../src/common';

const JWT_SECRET = process.env.JWT_SECRET || 'ci-only-secret-not-used-anywhere-else';

export function createTestToken(user: AuthenticatedUser): string {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
}

export const mockJwtAuthGuard = {
  canActivate: (context: ExecutionContext): boolean => {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
      request.user = { id: decoded.id, role: decoded.role };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  },
};
