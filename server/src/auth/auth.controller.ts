import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/types';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiCookieAuth('access_token')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Register a new user (admin only)' })
  @ResponseMessage('User created successfully')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login and set access token cookie' })
  @ResponseMessage('User login successfully')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto);
    // Set the access token in a cookie
    response.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    return {
      user: result.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiCookieAuth('access_token')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get current logged-in user profile' })
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiCookieAuth('access_token')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout and clear access token cookie' })
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    return this.authService.logout();
  }
}
