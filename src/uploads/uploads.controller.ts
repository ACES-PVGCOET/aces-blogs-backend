import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { UploadsService } from './uploads.service.js';
import { JwtAuthGuard, Roles, RolesGuard, UserRole } from '../common/index.js';

@ApiTags('Uploads')
@ApiBearerAuth()
@ApiCookieAuth('aces_session')
@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadsController {
  constructor(private readonly uploads: UploadsService) {}

  @Post('image')
  @Roles(UserRole.ADMIN, UserRole.WRITER)
  @ApiOperation({
    summary: 'Upload image asset',
    description: 'Uploads an image file (max 5MB) to Cloudinary and returns secure URL.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Invalid file format or missing file' })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }))
  upload(@UploadedFile() file?: Express.Multer.File) {
    return this.uploads.upload(file);
  }
}
