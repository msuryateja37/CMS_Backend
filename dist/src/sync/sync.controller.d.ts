import type { Request } from 'express';
import { SyncService } from './sync.service';
export declare class SyncController {
    private readonly sync;
    constructor(sync: SyncService);
    push(req: Request, body: any): Promise<{
        status: string;
        queued: number;
    }>;
    pull(since?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        updatedAt: Date;
        status: string;
        action: string;
        entity: string;
        entityId: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    resolve(body: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        updatedAt: Date;
        status: string;
        action: string;
        entity: string;
        entityId: string;
        payload: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
