import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth';
import { BlogModule } from './blog';
import { CategoriesModule } from './categories';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma';
import { UploadsModule } from './uploads';
import { UsersModule } from './users';

/**
 * Written once. Every teammate's module is already imported, so nobody needs to edit this file.
 * Database models live in prisma/schema.prisma; PrismaModule is global, so just inject PrismaService.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    BlogModule,
    CategoriesModule,
    UploadsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
