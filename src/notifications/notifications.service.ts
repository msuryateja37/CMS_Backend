import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    title: string,
    message: string,
    module: string,
    referenceId?: string,
  ) {
    // Disabled as per user request to turn off notifications
    return null;
    /*
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
        module,
        referenceId: referenceId ?? null,
      },
    });
    */
  }

  async getForUser(userId: string, take = 50) {
    return [];
  }

  async getUnreadCount(userId: string) {
    return 0;
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
