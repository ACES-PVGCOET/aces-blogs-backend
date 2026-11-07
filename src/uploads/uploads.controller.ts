import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadsService } from './uploads.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guards.js';
import { Roles } from '../auth/decorators/roles.decorators.js';
import { UserRole } from '../generated/prisma/client.js';
@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}
  @Post('image') @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  upload(@UploadedFile() file?: Express.Multer.File) { return this.uploads.upload(file); }
}
