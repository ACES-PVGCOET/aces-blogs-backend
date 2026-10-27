var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service.js';
import { UserStatus } from '../generated/prisma/client.js';
let JwtStrategy = class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    users;
    constructor(config, users) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => request?.cookies?.aces_session ?? null,
            ]),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow('JWT_SECRET'),
            issuer: 'aces-blog-api',
            audience: 'aces-blog-web',
        });
        this.users = users;
    }
    async validate(payload) {
        if (typeof payload?.sub !== 'string' ||
            !Number.isInteger(payload.sv)) {
            throw new UnauthorizedException('Invalid session');
        }
        const user = await this.users.findSessionIdentityById(payload.sub);
        if (!user ||
            user.status !== UserStatus.ACTIVE ||
            user.sessionVersion !== payload.sv) {
            throw new UnauthorizedException('Session expired or revoked');
        }
        return {
            id: user.id,
            role: user.role,
        };
    }
};
JwtStrategy = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService,
        UsersService])
], JwtStrategy);
export { JwtStrategy };
//# sourceMappingURL=jwt.strategy.js.map