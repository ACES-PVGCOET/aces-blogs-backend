import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  UserRole,
  UserStatus,
} from '../generated/prisma/client.js';

import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RoleChangeLogService {
  constructor(private readonly prisma: PrismaService) {}

  async changeRole(
    actorId: string,
    targetUserId: string,
    newRole: UserRole,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const actor = await tx.user.findUnique({
        where: { id: actorId },
      });

      if (
        !actor ||
        actor.status !== UserStatus.ACTIVE ||
        actor.role !== UserRole.ADMIN
      ) {
        throw new ForbiddenException('Only an active admin can change roles');
      }

      const target = await tx.user.findUnique({
        where: { id: targetUserId },
      });

      if (!target) {
        throw new NotFoundException('Target user not found');
      }

      if (target.role === newRole) {
        return target;
      }

      const updatedUser = await tx.user.update({
        where: { id: targetUserId },
        data: {
          role: newRole,
          sessionVersion: { increment: 1 },
        },
      });

      await tx.roleChangeLog.create({
        data: {
          targetUserId,
          changedBy: actorId,
          oldRole: target.role,
          newRole,
        },
      });

      return updatedUser;
    });
  }
}