import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, title: string, message: string, module: string, referenceId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        module: string;
        referenceId: string | null;
        isRead: boolean;
    }>;
    getForUser(userId: string, take?: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        module: string;
        referenceId: string | null;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<number>;
    markAsRead(notificationId: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
