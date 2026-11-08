import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Root application greeting',
    description: 'Returns API welcome status.',
  })
  @ApiResponse({ status: 200, description: 'Welcome greeting' })
  getHello(): string {
    return this.appService.getHello();
  }
}
