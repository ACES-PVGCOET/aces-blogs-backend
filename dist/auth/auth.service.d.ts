import { JwtService } from '@nestjs/jwt';
import { UserStatus } from '../generated/prisma/client.js';
import { UsersService } from '../users/users.service.js';
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    constructor(users: UsersService, jwt: JwtService);
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            profileImg: string | null;
            linkedIn: string | null;
            bio: string | null;
            role: import("../generated/prisma/enums.js").UserRole;
            status: UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    logoutAll(userId: string): Promise<{
        message: string;
    }>;
}
