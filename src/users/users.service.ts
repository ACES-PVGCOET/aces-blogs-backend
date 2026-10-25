
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as argon2 from 'argon2';

import {
  Prisma,
  UserRole,
  UserStatus,
} from '../generated/prisma/client.js';

import { PrismaService } from '../prisma/prisma.service.js';

import type {
  CreateUserInput,
  UpdateProfileInput,
} from './users.types.js';

// Safe fields returned to other application components.
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
} as const;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // Internal permission check for admin operations.
  private async requireAdmin(
    tx: Prisma.TransactionClient,
    actorId: string,
  ) {
    const actor = await tx.user.findUnique({
      where: { id: actorId },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });

    if (
      !actor ||
      actor.role !== UserRole.ADMIN ||
      actor.status !== UserStatus.ACTIVE
    ) {
      throw new ForbiddenException(
        'Administrator permission required',
      );
    }
  }

  // 1. FIND USER BY EMAIL (AUTHENTICATION ONLY)
  async findByEmailForAuth(email: string) {
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

  // 2. FIND USER BY ID
  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: safeUserSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Internal lookup for JWT validation.
  async findSessionIdentityById(id: string) {
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

  // 3. CREATE USER (ADMIN ONLY)
  async createUser(
    actorId: string,
    input: CreateUserInput,
  ) {
    const email = normalizeEmail(input.email);
    const name = input.name.trim();

    if (name.length < 2 || name.length > 100) {
      throw new BadRequestException('Invalid name');
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      throw new BadRequestException('Invalid email');
    }

    if (
      input.password.length < 12 ||
      input.password.length > 128
    ) {
      throw new BadRequestException(
        'Password must contain 12 to 128 characters',
      );
    }

    if (
      input.bio !== undefined &&
      input.bio.length > 500
    ) {
      throw new BadRequestException('Bio is too long');
    }

    const passwordHash = await argon2.hash(
      input.password,
      { type: argon2.argon2id },
    );

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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Email already registered',
        );
      }

      throw error;
    }
  }

  // 4. GET ALL USERS (ADMIN ONLY)
  async getAllUsers(
    actorId: string,
    page = 1,
    limit = 10,
    filters: { role?: UserRole; status?: UserStatus; search?: string } = {},
  ) {
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 50
    ) {
      throw new BadRequestException(
        'Invalid pagination',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      await this.requireAdmin(tx, actorId);

      const where: Prisma.UserWhereInput = {
        status: filters.status ?? { not: UserStatus.DELETED },
        ...(filters.role ? { role: filters.role } : {}),
        ...(filters.search?.trim() ? {
          OR: [
            { name: { contains: filters.search.trim(), mode: 'insensitive' } },
            { email: { contains: filters.search.trim(), mode: 'insensitive' } },
          ],
        } : {}),
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

  // 5. UPDATE OWN PROFILE
  async updateProfile(
    userId: string,
    input: UpdateProfileInput,
  ) {
    const user = await this.findSessionIdentityById(userId);

    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        'Active account required',
      );
    }

    if (
      input.name !== undefined &&
      (
        input.name.trim().length < 2 ||
        input.name.trim().length > 100
      )
    ) {
      throw new BadRequestException('Invalid name');
    }

    if (
      input.bio !== undefined &&
      input.bio.length > 500
    ) {
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

  // 6. CHANGE USER ROLE (ADMIN ONLY)
  async changeRole(
    actorId: string,
    targetId: string,
    role: UserRole,
  ) {
    if (actorId === targetId) {
      throw new BadRequestException(
        'Cannot change your own role',
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        await this.requireAdmin(tx, actorId);

        const target = await tx.user.findUnique({
          where: { id: targetId },
        });

        if (!target || target.status === UserStatus.DELETED) {
          throw new NotFoundException('User not found');
        }

        if (
          target.role === UserRole.ADMIN &&
          role !== UserRole.ADMIN &&
          target.status === UserStatus.ACTIVE
        ) {
          const adminCount = await tx.user.count({
            where: {
              role: UserRole.ADMIN,
              status: UserStatus.ACTIVE,
            },
          });

          if (adminCount <= 1) {
            throw new ConflictException(
              'Cannot remove the last active admin',
            );
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
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  // 7. CHANGE USER STATUS (ADMIN ONLY)
  async changeStatus(
    actorId: string,
    targetId: string,
    status: UserStatus,
  ) {
    if (actorId === targetId) {
      throw new BadRequestException(
        'Cannot change your own account status',
      );
    }

    return this.prisma.$transaction(
      async (tx) => {
        await this.requireAdmin(tx, actorId);

        const target = await tx.user.findUnique({
          where: { id: targetId },
        });

        if (!target) {
          throw new NotFoundException('User not found');
        }

        if (target.status === UserStatus.DELETED) {
          throw new ConflictException(
            'Deleted accounts cannot be reactivated',
          );
        }

        if (
          target.role === UserRole.ADMIN &&
          target.status === UserStatus.ACTIVE &&
          status !== UserStatus.ACTIVE
        ) {
          const adminCount = await tx.user.count({
            where: {
              role: UserRole.ADMIN,
              status: UserStatus.ACTIVE,
            },
          });

          if (adminCount <= 1) {
            throw new ConflictException(
              'Cannot disable the last active admin',
            );
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
      },
      {
        isolationLevel:
          Prisma.TransactionIsolationLevel.Serializable,
      },
    );
  }

  // 8. SOFT DELETE USER (ADMIN ONLY)
  async deleteUser(
    actorId: string,
    targetId: string,
  ) {
    return this.changeStatus(
      actorId,
      targetId,
      UserStatus.DELETED,
    );
  }

  // Internal operation: revoke all sessions for one user.
  async invalidateSessions(userId: string) {
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
      throw new UnauthorizedException(
        'Active session required',
      );
    }
  }
}
