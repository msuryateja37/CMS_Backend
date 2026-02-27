import { Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.notifications.getForUser(user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  async unreadCount(@Req() req: Request) {
    const user = req.user as { sub: string };
    const count = await this.notifications.getUnreadCount(user.sub);
    return { count };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  async markAsRead(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as { sub: string };
    await this.notifications.markAsRead(id, user.sub);
    return { success: true };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('read-all')
  async markAllAsRead(@Req() req: Request) {
    const user = req.user as { sub: string };
    await this.notifications.markAllAsRead(user.sub);
    return { success: true };
  }
}
