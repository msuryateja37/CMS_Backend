import { PrismaService } from '../prisma/prisma.service';
export declare class OhsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createRisk(userId: string, body: any): import("@prisma/client").Prisma.Prisma__RiskRegisterClient<{
        id: string;
        departmentId: string | null;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
        title: string;
        riskLevel: string;
        mitigation: string | null;
        createdById: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    listRisks(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        departmentId: string | null;
        createdAt: Date;
        description: string | null;
        updatedAt: Date;
        title: string;
        riskLevel: string;
        mitigation: string | null;
        createdById: string | null;
    }[]>;
    createJsa(userId: string, body: any): import("@prisma/client").Prisma.Prisma__JsaClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string | null;
        createdById: string | null;
        jobName: string;
        hazards: import("@prisma/client/runtime/library").JsonValue | null;
        controls: import("@prisma/client/runtime/library").JsonValue | null;
        remarks: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    scheduleInspection(body: any): import("@prisma/client").Prisma.Prisma__InspectionClient<{
        id: string;
        createdAt: Date;
        buildingId: string | null;
        updatedAt: Date;
        status: string;
        type: string;
        conductedAt: Date | null;
        inspectorId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    submitInspection(id: string, body: any): Promise<{
        id: string;
        createdAt: Date;
        buildingId: string | null;
        updatedAt: Date;
        status: string;
        type: string;
        conductedAt: Date | null;
        inspectorId: string | null;
    }>;
    listInspections(buildingId?: string): import("@prisma/client").Prisma.PrismaPromise<({
        findings: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: string;
            finding: string;
            actionRequired: string | null;
            dueDate: Date | null;
            inspectionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        buildingId: string | null;
        updatedAt: Date;
        status: string;
        type: string;
        conductedAt: Date | null;
        inspectorId: string | null;
    })[]>;
    addFinding(body: any): import("@prisma/client").Prisma.Prisma__InspectionFindingClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        finding: string;
        actionRequired: string | null;
        dueDate: Date | null;
        inspectionId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    closeFinding(id: string): import("@prisma/client").Prisma.Prisma__InspectionFindingClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        finding: string;
        actionRequired: string | null;
        dueDate: Date | null;
        inspectionId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    listHazards(): Promise<({
        building: {
            id: string;
            name: string;
            provinceId: string;
            createdAt: Date;
            address: string | null;
            postalCode: string | null;
            latitude: number | null;
            longitude: number | null;
        };
        reportedBy: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            employeeNumber: string | null;
            departmentId: string | null;
            provinceId: string | null;
            createdAt: Date;
            isActive: boolean;
            lastLoginAt: Date | null;
            deletedAt: Date | null;
        };
    } & {
        id: string;
        departmentId: string | null;
        createdAt: Date;
        isActive: boolean;
        deletedAt: Date | null;
        description: string;
        buildingId: string;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.IncidentStatus;
        latitude: number | null;
        longitude: number | null;
        type: string | null;
        incidentNumber: string;
        category: string;
        severity: string;
        immediateActions: string | null;
        otherActions: string | null;
        impact: string | null;
        location: string | null;
        peopleImpacted: number | null;
        reportedById: string;
        occurredAt: Date;
        isEscalated: boolean;
        escalatedAt: Date | null;
        escalationReason: string | null;
    })[]>;
    listJsa(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string | null;
        createdById: string | null;
        jobName: string;
        hazards: import("@prisma/client/runtime/library").JsonValue | null;
        controls: import("@prisma/client/runtime/library").JsonValue | null;
        remarks: string | null;
    }[]>;
    listSwp(): Promise<never[]>;
    getStats(): Promise<{
        total: number;
        open: number;
        closed: number;
    }>;
}
