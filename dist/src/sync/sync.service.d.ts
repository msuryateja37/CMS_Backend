import { PrismaService } from '../prisma/prisma.service';
export declare class SyncService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    push(userId: string, body: any): Promise<{
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
