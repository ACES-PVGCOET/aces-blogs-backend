
import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { RoleChangeLogService } from './role-change-log.service.js';

@Module({
  providers: [UsersService, RoleChangeLogService],
  exports: [UsersService, RoleChangeLogService],
})

export class UsersModule {}
