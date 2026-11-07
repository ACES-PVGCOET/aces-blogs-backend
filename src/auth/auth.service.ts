import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

import { UserStatus } from '../generated/prisma/client.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  // Verify credentials and create a session token.
  async login(email: string, password: string) {
    const user = await this.users.findByEmailForAuth(
      email,
    );

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    let passwordValid = false;

    try {
      passwordValid = await argon2.verify(
        user.passwordHash,
        password,
      );
    } catch {
      passwordValid = false;
    }

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      sv: user.sessionVersion,
    });

    const profile = await this.users.findById(user.id);

    return {
      accessToken,
      user: profile,
    };
  }

  // Revoke existing tokens by increasing the version.
  async logoutAll(userId: string) {
    await this.users.invalidateSessions(userId);

    return {
      message: 'Sessions invalidated',
    };
  }
}
