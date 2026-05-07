import { PrismaService } from '../prisma/prisma.service';
export declare class OperationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listEquipment(): Promise<({
        building: {
            id: string;
            name: string;
            provinceId: string;
            createdAt: Date;
            address: string | null;
            postalCode: string | null;
            latitude: number | null;
            longitude: number | null;
        } | null;
    } & {
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
    })[]>;
    listInspections(): Promise<({
        building: {
            id: string;
            name: string;
            provinceId: string;
            createdAt: Date;
            address: string | null;
            postalCode: string | null;
            latitude: number | null;
            longitude: number | null;
        } | null;
        inspector: {
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
        } | null;
    } & {
        id: string;
        createdAt: Date;
        buildingId: string | null;
        updatedAt: Date;
        type: string;
        status: string;
        conductedAt: Date | null;
        inspectorId: string | null;
    })[]>;
    listDrills(): Promise<({
        building: {
            id: string;
            name: string;
            provinceId: string;
            createdAt: Date;
            address: string | null;
            postalCode: string | null;
            latitude: number | null;
            longitude: number | null;
        } | null;
    } & {
        id: string;
        name: string;
        createdAt: Date;
        buildingId: string | null;
        updatedAt: Date;
        type: string;
        status: string;
        scheduledDate: Date;
    })[]>;
    listAudits(): Promise<({
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
        status: import("@prisma/client").$Enums.IncidentStatus;
        reportedById: string;
        occurredAt: Date;
        isEscalated: boolean;
        escalatedAt: Date | null;
        escalationReason: string | null;
    })[]>;
    listPermits(): Promise<({
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
        status: import("@prisma/client").$Enums.IncidentStatus;
        reportedById: string;
        occurredAt: Date;
        isEscalated: boolean;
        escalatedAt: Date | null;
        escalationReason: string | null;
    })[]>;
}
