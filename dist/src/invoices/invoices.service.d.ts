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
    }>;
    actions(invoiceId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        action: string;
        actorId: string;
        timestamp: Date;
        invoiceId: string;
    }[]>;
}
