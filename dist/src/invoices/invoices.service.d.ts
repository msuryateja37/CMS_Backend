import { PrismaService } from '../prisma/prisma.service';
export declare class InvoicesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(body: any): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        incidentId: string | null;
        invoiceNumber: string | null;
        amount: number;
        receivedDate: Date | null;
        taskId: string;
    }>;
    list(status?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        description: string | null;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        incidentId: string | null;
        invoiceNumber: string | null;
        amount: number;
        receivedDate: Date | null;
        taskId: string;
    }[]>;
    getById(id: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        incidentId: string | null;
        invoiceNumber: string | null;
        amount: number;
        receivedDate: Date | null;
        taskId: string;
    }>;
    transition(id: string, newStatus: string, performedById: string, note?: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        incidentId: string | null;
        invoiceNumber: string | null;
        amount: number;
        receivedDate: Date | null;
        taskId: string;
    }>;
    actions(invoiceId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        action: string;
        actorId: string;
        timestamp: Date;
        invoiceId: string;
    }[]>;
}
