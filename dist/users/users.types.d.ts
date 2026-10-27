import type { UserRole } from '../generated/prisma/client.js';
export type CreateUserInput = {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    bio?: string;
    profileImg?: string;
    linkedIn?: string;
};
export type UpdateProfileInput = {
    name?: string;
    bio?: string;
    profileImg?: string;
    linkedIn?: string;
};
