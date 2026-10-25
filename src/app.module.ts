import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth';
import { BlogModule } from './blog';
import { CategoriesModule } from './categories';
import { HealthController } from './health.controller';
import { UploadsModule } from './uploads';
import { UsersModule } from './users';

/**
 * Written once. Every teammate's module is already imported, so nobody needs to edit this file.
 * Entities register themselves: each module lists its own in TypeOrmModule.forFeature([...]).
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get('DB_PORT', 5432)),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_NAME', 'blog_app'),
        autoLoadEntities: true,
        // Only when you explicitly ask for it (DB_SYNC=true in your local .env). Production must use migrations.
        synchronize: config.get<string>('DB_SYNC') === 'true',
      }),
    }),
    UsersModule,
    AuthModule,
    BlogModule,
    CategoriesModule,
    UploadsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
