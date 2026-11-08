import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import {
  type AuthenticatedUser,
  CurrentUser,
  JwtAuthGuard,
} from '../common/index.js';
import { UsersService } from '../users/users.service.js';

const COOKIE_NAME = 'aces_session';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticate user',
    description:
      'Validates credentials, issues JWT accessToken in response body, and sets aces_session HttpOnly cookie.',
  })
  @ApiResponse({ status: 200, description: 'Authentication successful' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto.email, dto.password);
    res.cookie(COOKIE_NAME, result.accessToken, getCookieOptions());
    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log out current session',
    description: 'Clears aces_session cookie.',
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('aces_session')
  @ApiOperation({
    summary: 'Revoke all active sessions',
    description:
      'Increments sessionVersion in database, instantly invalidating all tokens and sessions across all devices.',
  })
  @ApiResponse({ status: 200, description: 'All sessions invalidated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logoutAll(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.logoutAll(user.id);
    res.clearCookie(COOKIE_NAME, { path: '/' });
    return result;
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCookieAuth('aces_session')
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Returns profile details and roles for the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findById(user.id);
  }
}
