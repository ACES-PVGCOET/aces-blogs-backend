
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

import { UsersService } from '../users/users.service.js';
import { UserStatus } from '../generated/prisma/client.js';

type JwtPayload = {
  sub: string;
  sv: number;
  iat?: number;
  exp?: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
    private readonly users: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request?.cookies?.aces_session ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey:
        config.getOrThrow<string>('JWT_SECRET'),
      issuer: 'aces-blog-api',
      audience: 'aces-blog-web',
    });
  }

  async validate(payload: JwtPayload) {
    if (
      typeof payload?.sub !== 'string' ||
      !Number.isInteger(payload.sv)
    ) {
      throw new UnauthorizedException('Invalid session');
    }

    const user =
      await this.users.findSessionIdentityById(
        payload.sub,
      );

    if (
      !user ||
      user.status !== UserStatus.ACTIVE ||
      user.sessionVersion !== payload.sv
    ) {
      throw new UnauthorizedException(
        'Session expired or revoked',
      );
    }

    return {
      id: user.id,
      role: user.role,
    };
  }
}
