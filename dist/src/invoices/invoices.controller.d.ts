import type { Request } from 'express';
import { InvoicesService } from './invoices.service';
export declare class InvoicesController {
    private readonly invoices;
    constructor(invoices: InvoicesService);
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
    get(id: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        incidentId: string | null;
        invoiceNumber: string | null;
        amount: number;
        receivedDate: Date | null;
    }>;
    approve(req: Request, id: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        incidentId: string | null;
        invoiceNumber: string | null;
        amount: number;
        receivedDate: Date | null;
    }>;
    reject(req: Request, id: string, body: {
        reason: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        incidentId: string | null;
        invoiceNumber: string | null;
        amount: number;
        receivedDate: Date | null;
    }>;
    actions(id: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        action: string;
        actorId: string;
        timestamp: Date;
        invoiceId: string;
    }[]>;
    finalize(req: Request, id: string): Promise<{
        id: string;
        createdAt: Date;
        description: string | null;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        incidentId: string | null;
        invoiceNumber: string | null;
        amount: number;
        receivedDate: Date | null;
    }>;
}
