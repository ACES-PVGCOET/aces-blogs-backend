import { UserRole, UserStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateUserInput, UpdateProfileInput } from './users.types.js';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private requireAdmin;
    findByEmailForAuth(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        passwordHash: string;
        role: UserRole;
        status: UserStatus;
        sessionVersion: number;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        profileImg: string | null;
        linkedIn: string | null;
        bio: string | null;
        role: UserRole;
        status: UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findSessionIdentityById(id: string): Promise<{
        id: string;
        role: UserRole;
        status: UserStatus;
        sessionVersion: number;
    } | null>;
    createUser(actorId: string, input: CreateUserInput): Promise<{
        id: string;
        name: string;
        email: string;
        profileImg: string | null;
        linkedIn: string | null;
        bio: string | null;
        role: UserRole;
        status: UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(actorId: string, page?: number, limit?: number): Promise<{
        data: {
            id: string;
            name: string;
            email: string;
            profileImg: string | null;
            linkedIn: string | null;
            bio: string | null;
            role: UserRole;
            status: UserStatus;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateProfile(userId: string, input: UpdateProfileInput): Promise<{
        id: string;
        name: string;
        email: string;
        profileImg: string | null;
        linkedIn: string | null;
        bio: string | null;
        role: UserRole;
        status: UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changeRole(actorId: string, targetId: string, role: UserRole): Promise<{
        id: string;
        name: string;
        email: string;
        profileImg: string | null;
        linkedIn: string | null;
        bio: string | null;
        role: UserRole;
        status: UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    changeStatus(actorId: string, targetId: string, status: UserStatus): Promise<{
        id: string;
        name: string;
        email: string;
        profileImg: string | null;
        linkedIn: string | null;
        bio: string | null;
        role: UserRole;
        status: UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(actorId: string, targetId: string): Promise<{
        id: string;
        name: string;
        email: string;
        profileImg: string | null;
        linkedIn: string | null;
        bio: string | null;
        role: UserRole;
        status: UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    invalidateSessions(userId: string): Promise<void>;
}
