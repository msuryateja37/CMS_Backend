import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly audit;
    constructor(audit: AuditService);
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        changedBy: string | null;
        changedAt: Date;
        action: import("@prisma/client").$Enums.AuditAction;
        tableName: string;
        recordId: string;
        oldData: import("@prisma/client/runtime/library").JsonValue | null;
        newData: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
}
