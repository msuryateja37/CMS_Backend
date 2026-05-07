import type { Request } from 'express';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notifications;
    constructor(notifications: NotificationsService);
    list(req: Request): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        message: string;
        module: string;
        referenceId: string | null;
        isRead: boolean;
    }[]>;
    unreadCount(req: Request): Promise<{
        count: number;
    }>;
    markAsRead(req: Request, id: string): Promise<{
        success: boolean;
    }>;
    markAllAsRead(req: Request): Promise<{
        success: boolean;
    }>;
}
