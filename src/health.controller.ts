import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service.js';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check probe',
    description: 'Pings PostgreSQL database via raw query. Returns 200 OK if healthy, 500 if unreachable.',
  })
  @ApiResponse({ status: 200, description: 'Service and database are healthy' })
  @ApiResponse({ status: 500, description: 'Database unreachable' })
  async check() {
    await this.prisma.$queryRaw`SELECT 1`; // fails (500) if the database is unreachable
    return { status: 'ok' };
  }
}
