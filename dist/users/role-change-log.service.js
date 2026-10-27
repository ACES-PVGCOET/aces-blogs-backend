var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable, NotFoundException, } from '@nestjs/common';
import { UserRole, UserStatus, } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
let RoleChangeLogService = class RoleChangeLogService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async changeRole(actorId, targetUserId, newRole) {
        return this.prisma.$transaction(async (tx) => {
            const actor = await tx.user.findUnique({
                where: { id: actorId },
            });
            if (!actor ||
                actor.status !== UserStatus.ACTIVE ||
                actor.role !== UserRole.ADMIN) {
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
};
RoleChangeLogService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], RoleChangeLogService);
export { RoleChangeLogService };
//# sourceMappingURL=role-change-log.service.js.map