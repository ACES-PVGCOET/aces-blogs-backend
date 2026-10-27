var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import * as argon2 from 'argon2';
import { Prisma, UserRole, UserStatus, } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
const safeUserSelect = {
    id: true,
    name: true,
    email: true,
    bio: true,
    profileImg: true,
    linkedIn: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
};
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async requireAdmin(tx, actorId) {
        const actor = await tx.user.findUnique({
            where: { id: actorId },
            select: {
                id: true,
                role: true,
                status: true,
            },
        });
        if (!actor ||
            actor.role !== UserRole.ADMIN ||
            actor.status !== UserStatus.ACTIVE) {
            throw new ForbiddenException('Administrator permission required');
        }
    }
    async findByEmailForAuth(email) {
        return this.prisma.user.findUnique({
            where: {
                email: normalizeEmail(email),
            },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                role: true,
                status: true,
                sessionVersion: true,
            },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: safeUserSelect,
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    async findSessionIdentityById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                role: true,
                status: true,
                sessionVersion: true,
            },
        });
    }
    async createUser(actorId, input) {
        const email = normalizeEmail(input.email);
        const name = input.name.trim();
        if (name.length < 2 || name.length > 100) {
            throw new BadRequestException('Invalid name');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new BadRequestException('Invalid email');
        }
        if (input.password.length < 12 ||
            input.password.length > 128) {
            throw new BadRequestException('Password must contain 12 to 128 characters');
        }
        if (input.bio !== undefined &&
            input.bio.length > 500) {
            throw new BadRequestException('Bio is too long');
        }
        const passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });
        try {
            return await this.prisma.$transaction(async (tx) => {
                await this.requireAdmin(tx, actorId);
                return tx.user.create({
                    data: {
                        name,
                        email,
                        passwordHash,
                        bio: input.bio,
                        profileImg: input.profileImg,
                        linkedIn: input.linkedIn,
                        role: input.role ?? UserRole.READER,
                        status: UserStatus.ACTIVE,
                    },
                    select: safeUserSelect,
                });
            });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                throw new ConflictException('Email already registered');
            }
            throw error;
        }
    }
    async getAllUsers(actorId, page = 1, limit = 10) {
        if (!Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 50) {
            throw new BadRequestException('Invalid pagination');
        }
        return this.prisma.$transaction(async (tx) => {
            await this.requireAdmin(tx, actorId);
            const where = {
                status: { not: UserStatus.DELETED },
            };
            const [users, total] = await Promise.all([
                tx.user.findMany({
                    where,
                    select: safeUserSelect,
                    orderBy: { createdAt: 'desc' },
                    skip: (page - 1) * limit,
                    take: limit,
                }),
                tx.user.count({ where }),
            ]);
            return {
                data: users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        });
    }
    async updateProfile(userId, input) {
        const user = await this.findSessionIdentityById(userId);
        if (!user || user.status !== UserStatus.ACTIVE) {
            throw new UnauthorizedException('Active account required');
        }
        if (input.name !== undefined &&
            (input.name.trim().length < 2 ||
                input.name.trim().length > 100)) {
            throw new BadRequestException('Invalid name');
        }
        if (input.bio !== undefined &&
            input.bio.length > 500) {
            throw new BadRequestException('Bio is too long');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(input.name !== undefined && {
                    name: input.name.trim(),
                }),
                ...(input.bio !== undefined && {
                    bio: input.bio,
                }),
                ...(input.profileImg !== undefined && {
                    profileImg: input.profileImg,
                }),
                ...(input.linkedIn !== undefined && {
                    linkedIn: input.linkedIn,
                }),
            },
            select: safeUserSelect,
        });
    }
    async changeRole(actorId, targetId, role) {
        if (actorId === targetId) {
            throw new BadRequestException('Cannot change your own role');
        }
        return this.prisma.$transaction(async (tx) => {
            await this.requireAdmin(tx, actorId);
            const target = await tx.user.findUnique({
                where: { id: targetId },
            });
            if (!target || target.status === UserStatus.DELETED) {
                throw new NotFoundException('User not found');
            }
            if (target.role === UserRole.ADMIN &&
                role !== UserRole.ADMIN &&
                target.status === UserStatus.ACTIVE) {
                const adminCount = await tx.user.count({
                    where: {
                        role: UserRole.ADMIN,
                        status: UserStatus.ACTIVE,
                    },
                });
                if (adminCount <= 1) {
                    throw new ConflictException('Cannot remove the last active admin');
                }
            }
            return tx.user.update({
                where: { id: targetId },
                data: {
                    role,
                    sessionVersion: { increment: 1 },
                },
                select: safeUserSelect,
            });
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
    }
    async changeStatus(actorId, targetId, status) {
        if (actorId === targetId) {
            throw new BadRequestException('Cannot change your own account status');
        }
        return this.prisma.$transaction(async (tx) => {
            await this.requireAdmin(tx, actorId);
            const target = await tx.user.findUnique({
                where: { id: targetId },
            });
            if (!target) {
                throw new NotFoundException('User not found');
            }
            if (target.status === UserStatus.DELETED) {
                throw new ConflictException('Deleted accounts cannot be reactivated');
            }
            if (target.role === UserRole.ADMIN &&
                target.status === UserStatus.ACTIVE &&
                status !== UserStatus.ACTIVE) {
                const adminCount = await tx.user.count({
                    where: {
                        role: UserRole.ADMIN,
                        status: UserStatus.ACTIVE,
                    },
                });
                if (adminCount <= 1) {
                    throw new ConflictException('Cannot disable the last active admin');
                }
            }
            return tx.user.update({
                where: { id: targetId },
                data: {
                    status,
                    sessionVersion: { increment: 1 },
                },
                select: safeUserSelect,
            });
        }, {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
    }
    async deleteUser(actorId, targetId) {
        return this.changeStatus(actorId, targetId, UserStatus.DELETED);
    }
    async invalidateSessions(userId) {
        const result = await this.prisma.user.updateMany({
            where: {
                id: userId,
                status: UserStatus.ACTIVE,
            },
            data: {
                sessionVersion: { increment: 1 },
            },
        });
        if (result.count !== 1) {
            throw new UnauthorizedException('Active session required');
        }
    }
};
UsersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map