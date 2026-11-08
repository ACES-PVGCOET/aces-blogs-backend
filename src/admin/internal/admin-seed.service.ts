import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

import { UserRole, UserStatus } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedSuperAdmin();
  }

  async seedSuperAdmin(): Promise<void> {
    const configuredEmail =
      this.configService.get<string>('SEED_ADMIN_EMAIL') ??
      this.configService.get<string>('ADMIN_EMAIL');

    const adminEmail = (configuredEmail ?? 'admin@aces.org').trim().toLowerCase();

    const adminPassword =
      this.configService.get<string>('SEED_ADMIN_PASSWORD') ??
      this.configService.get<string>('ADMIN_PASSWORD') ??
      'Admin@123456!';

    const adminName =
      this.configService.get<string>('SEED_ADMIN_NAME') ??
      this.configService.get<string>('ADMIN_NAME') ??
      'Super Admin';

    try {
      // 1. Check if a user with the target email already exists
      const existingUserByEmail = await this.prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (existingUserByEmail) {
        if (existingUserByEmail.role !== UserRole.ADMIN) {
          await this.prisma.user.update({
            where: { id: existingUserByEmail.id },
            data: {
              role: UserRole.ADMIN,
              status: UserStatus.ACTIVE,
            },
          });
          this.logger.log(
            `User "${adminEmail}" already existed and has been updated to ADMIN role.`,
          );
        } else {
          this.logger.log(`Super Admin "${adminEmail}" already exists in the database.`);
        }
        return;
      }

      // 2. If no explicit admin email was provided, check if ANY admin exists in DB
      if (!configuredEmail) {
        const anyAdmin = await this.prisma.user.findFirst({
          where: { role: UserRole.ADMIN },
        });

        if (anyAdmin) {
          this.logger.log(
            `Admin user already exists in DB (${anyAdmin.email}). Skipping default admin creation.`,
          );
          return;
        }
      }

      // 3. Inject Super Admin
      const passwordHash = await argon2.hash(adminPassword);
      const newAdmin = await this.prisma.user.create({
        data: {
          email: adminEmail,
          name: adminName,
          passwordHash,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
        },
      });

      this.logger.log(
        `✅ Super Admin injected successfully: ${newAdmin.email} (ID: ${newAdmin.id})`,
      );
    } catch (error) {
      this.logger.error('Failed to ensure Super Admin during startup:', error);
    }
  }
}
