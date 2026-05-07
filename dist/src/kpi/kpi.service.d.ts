import { PrismaService } from '../prisma/prisma.service';
export declare class KpiService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(body: any): import("@prisma/client").Prisma.Prisma__KpiClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        targetValue: number;
        unit: string;
        frequency: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    list(): import("@prisma/client").Prisma.PrismaPromise<({
        records: {
            id: string;
            value: number;
            period: string;
            recordedAt: Date;
            kpiId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        targetValue: number;
        unit: string;
        frequency: string;
    })[]>;
    record(body: any): import("@prisma/client").Prisma.Prisma__KpiRecordClient<{
        id: string;
        value: number;
        period: string;
        recordedAt: Date;
        kpiId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    getDashboardMetrics(): Promise<{
        totalCases: number;
        activeCases: number;
        escalatedCases: number;
        closedCases: number;
        avgResponseTime: number;
        activeAssignmentsCount: number;
        escalatedCasesCount: number;
        closureRate: number;
    }>;
    getMetricsByProvince(provinceId: string): Promise<{
        provinceId: string;
        totalCases: number;
        activeCases: number;
        escalatedCases: number;
        closureRate: number;
    }>;
    getMetricsByBuilding(buildingId: string): Promise<{
        buildingId: string;
        totalCases: number;
        activeCases: number;
        escalatedCases: number;
        closureRate: number;
    }>;
    getMetricsByCategory(category: string): Promise<{
        categoryId: string;
        totalCases: number;
        activeCases: number;
        escalatedCases: number;
        closureRate: number;
    }>;
    getMetricsByPriority(): Promise<any>;
}
