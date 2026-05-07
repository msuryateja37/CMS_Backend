import type { Request } from 'express';
import { CasesService } from './cases.service';
import { StorageService } from '../system/storage.service';
export declare class CasesController {
    private readonly cases;
    private readonly storage;
    constructor(cases: CasesService, storage: StorageService);
    uploadFile(file: Express.Multer.File, incidentId?: string): Promise<{
        url: string;
        name: string;
        size: number;
        type: string;
    }>;
    create(req: Request, body: any): Promise<{
        building: {
            id: string;
            name: string;
            province: {
                id: string;
                name: string;
            };
        };
        reportedBy: {
            id: string;
            name: string;
            email: string;
        };
        media: {
            id: string;
            incidentId: string;
            fileUrl: string;
            fileType: string;
            uploaderRole: string | null;
            uploadedAt: Date;
            uploadedById: string | null;
        }[];
        impactedPeople: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            createdAt: Date;
            incidentId: string;
        }[];
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
    }>;
    list(query: any): Promise<{
        data: any[];
        total: number;
    }>;
    getKpiMetrics(): Promise<{
        totalCases: number;
        openCases: number;
        inProgressCases: number;
        escalatedCases: number;
        closedCases: number;
        activeCases: number;
        avgResponseTime: number;
        closureRate: number;
    }>;
    categories(): Promise<{
        id: string;
        name: string;
    }[]>;
    getEmployeeStats(req: Request): Promise<{
        activeCases: number;
        pendingActions: number;
        resolvedCases: number;
        activeCasesChange: string;
        pendingActionsChange: string;
        resolvedCasesChange: string;
    }>;
    getUpcomingHearings(req: Request): Promise<never[]>;
    createCategory(body: any): Promise<{
        message: string;
    }>;
    updateCategory(id: string, body: any): Promise<{}>;
    deleteCategory(id: string): Promise<{}>;
    getSlaTracking(): Promise<{
        id: string;
        incidentId: string;
        incidentNumber: string;
        category: string;
        severity: string;
        status: import("@prisma/client").$Enums.IncidentStatus;
        isEscalated: boolean;
        assignedTo: {
            id: string;
            name: string;
        };
        responseDueAt: Date;
        resolutionDueAt: Date;
        responseBreached: boolean;
        resolutionBreached: boolean;
        responseHoursLeft: number;
        resolutionHoursLeft: number;
        totalResolutionHours: number;
        progress: number;
        slaStatus: string;
    }[]>;
    get(id: string): Promise<any>;
    update(id: string, body: any): Promise<{
        department: {
            id: string;
            name: string;
            buildingId: string | null;
        } | null;
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
    }>;
    assign(req: Request, id: string, body: {
        assignedToId: string;
    }): Promise<any>;
    updateStatus(req: Request, id: string, body: {
        status: string;
    }): Promise<{
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
    escalate(req: Request, id: string, body: {
        assignedToId: string;
        reason: string;
    }): Promise<any>;
    uploadEvidence(req: Request, id: string, body: any): Promise<{
        fileUrl: string;
        id: string;
        incidentId: string;
        fileType: string;
        uploaderRole: string | null;
        uploadedAt: Date;
        uploadedById: string | null;
    }>;
    listEvidence(id: string): Promise<{
        fileUrl: string;
        id: string;
        incidentId: string;
        fileType: string;
        uploaderRole: string | null;
        uploadedAt: Date;
        uploadedById: string | null;
    }[]>;
    createEscalationConfig(id: string, body: any): Promise<{}>;
    getEscalationConfig(id: string): Promise<{}>;
    updateEscalationConfig(id: string, body: any): Promise<{}>;
    addComment(req: Request, id: string, body: {
        comment: string;
    }): Promise<{
        id: string;
        comment: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
        createdAt: Date;
    }>;
    getComments(id: string): Promise<{
        id: string;
        comment: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
        createdAt: Date;
    }[]>;
    getActivityTimeline(id: string): Promise<{
        id: string;
        type: string;
        oldStatus: import("@prisma/client").$Enums.IncidentStatus | null;
        newStatus: import("@prisma/client").$Enums.IncidentStatus;
        description: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
        timestamp: Date;
    }[]>;
    addActivity(req: Request, id: string, body: any): Promise<void>;
    close(req: Request, id: string): Promise<{
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
    delete(id: string): Promise<{
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
