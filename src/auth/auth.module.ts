
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { UsersModule } from '../users/users.module.js';

import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';

import {
  JwtAuthGuard,
} from './guards/jwt-auth.guard.js';

import {
  RolesGuard,
} from './guards/roles.guards.js';

@Module({
  imports: [
    UsersModule,
    PassportModule,

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        secret:
          config.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: '15m',
          issuer: 'aces-blog-api',
          audience: 'aces-blog-web',
        },
      }),
    }),
  ],

  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],

  exports: [
    AuthService,
    JwtAuthGuard,
    RolesGuard,
  ],
})
export class AuthModule {}
