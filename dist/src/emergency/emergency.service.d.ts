import { PrismaService } from '../prisma/prisma.service';
export declare class EmergencyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPlan(body: any): import("@prisma/client").Prisma.Prisma__EmergencyPlanClient<{
        id: string;
        createdAt: Date;
        title: string;
        version: string;
        updatedAt: Date;
        fileUrl: string | null;
        documentPath: string | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    listPlans(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        title: string;
        version: string;
        updatedAt: Date;
        fileUrl: string | null;
        documentPath: string | null;
    }[]>;
    registerEquipment(body: any): import("@prisma/client").Prisma.Prisma__EquipmentClient<{
        id: string;
        name: string;
        createdAt: Date;
        buildingId: string | null;
        updatedAt: Date;
        type: string;
        status: string;
        serialNumber: string | null;
        lastServiceDate: Date | null;
        nextServiceDate: Date | null;
        lastChecked: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    listEquipment(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        buildingId: string | null;
        updatedAt: Date;
        type: string;
        status: string;
        serialNumber: string | null;
        lastServiceDate: Date | null;
        nextServiceDate: Date | null;
        lastChecked: Date | null;
    }[]>;
    recordDrill(body: any): import("@prisma/client").Prisma.Prisma__DrillClient<{
        id: string;
        name: string;
        createdAt: Date;
        buildingId: string | null;
        updatedAt: Date;
        type: string;
        status: string;
        scheduledDate: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    listDrills(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        buildingId: string | null;
        updatedAt: Date;
        type: string;
        status: string;
        scheduledDate: Date;
    }[]>;
}
