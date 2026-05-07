import { KpiService } from './kpi.service';
export declare class KpiController {
    private readonly kpi;
    constructor(kpi: KpiService);
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
    getMetricsByCategory(categoryId: string): Promise<{
        categoryId: string;
        totalCases: number;
        activeCases: number;
        escalatedCases: number;
        closureRate: number;
    }>;
    getMetricsByPriority(): Promise<any>;
    record(body: any): import("@prisma/client").Prisma.Prisma__KpiRecordClient<{
        id: string;
        value: number;
        period: string;
        recordedAt: Date;
        kpiId: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
