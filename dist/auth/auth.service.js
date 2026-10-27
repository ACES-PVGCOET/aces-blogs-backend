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
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserStatus } from '../generated/prisma/client.js';
import { UsersService } from '../users/users.service.js';
let AuthService = class AuthService {
    users;
    jwt;
    constructor(users, jwt) {
        this.users = users;
        this.jwt = jwt;
    }
    async login(email, password) {
        const user = await this.users.findByEmailForAuth(email);
        if (!user || user.status !== UserStatus.ACTIVE) {
            throw new UnauthorizedException('Invalid email or password');
        }
        let passwordValid = false;
        try {
            passwordValid = await argon2.verify(user.passwordHash, password);
        }
        catch {
            passwordValid = false;
        }
        if (!passwordValid) {
            throw new UnauthorizedException('Invalid email or password');
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
    async logoutAll(userId) {
        await this.users.invalidateSessions(userId);
        return {
            message: 'Sessions invalidated',
        };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UsersService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map