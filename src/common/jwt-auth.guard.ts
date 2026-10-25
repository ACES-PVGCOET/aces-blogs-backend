import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Protects a route with the 'jwt' passport strategy.
 * The strategy itself is implemented by the user-mgmt branch (src/auth). Until that is merged,
 * routes using this guard can't authenticate: in your tests, override it:
 *   Test.createTestingModule({...}).overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
