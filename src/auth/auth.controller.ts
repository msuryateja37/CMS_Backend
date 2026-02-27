import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1) Login (Public)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // 2) Refresh token (Public)
  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  // 3) Get current user (Authenticated)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.authService.getCurrentUser(user.sub);
  }

  // 4) Logout (Authenticated)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.authService.logoutAll(user.sub);
  }

  // 5) Update own profile (Authenticated)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Req() req: Request,
    @Body()
    body: {
      fullName?: string;
      phone?: string;
      provinceId?: string;
      departmentId?: string;
    },
  ) {
    const user = req.user as { sub: string };
    return this.authService.updateProfile(user.sub, body);
  }
}
