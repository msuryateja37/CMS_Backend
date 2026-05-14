import { PrismaService } from '../prisma/prisma.service';
export declare class PdcaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(body: any): import("@prisma/client").Prisma.Prisma__PdcaActionClient<{
        id: string;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
        title: string;
        status: string;
        phase: string;
        ownerId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, body: any): import("@prisma/client").Prisma.Prisma__PdcaActionClient<{
        id: string;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
        title: string;
        status: string;
        phase: string;
        ownerId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
        title: string;
        status: string;
        phase: string;
        ownerId: string | null;
    }[]>;
}
