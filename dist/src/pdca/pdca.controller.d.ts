import { PdcaService } from './pdca.service';
export declare class PdcaController {
    private readonly pdca;
    constructor(pdca: PdcaService);
    create(body: any): import("@prisma/client").Prisma.Prisma__PdcaActionClient<{
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        updatedAt: Date;
        status: string;
        phase: string;
        ownerId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, body: any): import("@prisma/client").Prisma.Prisma__PdcaActionClient<{
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        updatedAt: Date;
        status: string;
        phase: string;
        ownerId: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    list(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        updatedAt: Date;
        status: string;
        phase: string;
        ownerId: string | null;
    }[]>;
}
