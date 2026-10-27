import { UserRole, UserStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
export declare class RoleChangeLogService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    changeRole(actorId: string, targetUserId: string, newRole: UserRole): Promise<{
        id: string;
        name: string;
        email: string;
        passwordHash: string;
        profileImg: string | null;
        linkedIn: string | null;
        bio: string | null;
        role: UserRole;
        status: UserStatus;
        sessionVersion: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
