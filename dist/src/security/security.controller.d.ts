import { SecurityService } from './security.service';
export declare class SecurityController {
    private readonly security;
    constructor(security: SecurityService);
    getStats(): Promise<{
        id: number;
        label: string;
        value: string;
    }[]>;
    getIncidents(): Promise<{
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
    }[]>;
    getTrends(): Promise<{
        name: string;
        count: number;
    }[]>;
    getSeverity(): Promise<{
        critical: number;
        high: number;
        medium: number;
        low: number;
    }>;
    createIncident(body: any): Promise<{
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
    }>;
}
