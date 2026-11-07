import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    await this.prisma.$queryRaw`SELECT 1`; // fails (500) if the database is unreachable
    return { status: 'ok' };
  }
}
