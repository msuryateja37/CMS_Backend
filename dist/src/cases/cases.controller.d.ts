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
            fileUrl: string;
            fileType: string;
            uploaderRole: string | null;
            uploadedAt: Date;
            uploadedById: string | null;
            incidentId: string;
        }[];
        impactedPeople: {
            id: string;
            createdAt: Date;
            name: string;
            email: string;
            phone: string | null;
            incidentId: string;
        }[];
    } & {
        id: string;
        incidentNumber: string;
        type: string | null;
        description: string;
        category: string;
        severity: string;
        immediateActions: string | null;
        otherActions: string | null;
        impact: string | null;
        location: string | null;
        peopleImpacted: number | null;
        status: import("@prisma/client").$Enums.IncidentStatus;
        latitude: number | null;
        longitude: number | null;
        occurredAt: Date;
        incidentPlan: string | null;
        createdAt: Date;
        updatedAt: Date;
        isEscalated: boolean;
        escalatedAt: Date | null;
        escalationReason: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        buildingId: string;
        departmentId: string | null;
        reportedById: string;
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
    update(req: Request, id: string, body: any): Promise<{
        building: {
            id: string;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            name: string;
            provinceId: string;
            address: string | null;
            postalCode: string | null;
        };
        department: {
            id: string;
            buildingId: string | null;
            name: string;
        } | null;
    } & {
        id: string;
        incidentNumber: string;
        type: string | null;
        description: string;
        category: string;
        severity: string;
        immediateActions: string | null;
        otherActions: string | null;
        impact: string | null;
        location: string | null;
        peopleImpacted: number | null;
        status: import("@prisma/client").$Enums.IncidentStatus;
        latitude: number | null;
        longitude: number | null;
        occurredAt: Date;
        incidentPlan: string | null;
        createdAt: Date;
        updatedAt: Date;
        isEscalated: boolean;
        escalatedAt: Date | null;
        escalationReason: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        buildingId: string;
        departmentId: string | null;
        reportedById: string;
    }>;
    assign(req: Request, id: string, body: {
        assignedToId: string;
    }): Promise<any>;
    updateStatus(req: Request, id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        incidentNumber: string;
        type: string | null;
        description: string;
        category: string;
        severity: string;
        immediateActions: string | null;
        otherActions: string | null;
        impact: string | null;
        location: string | null;
        peopleImpacted: number | null;
        status: import("@prisma/client").$Enums.IncidentStatus;
        latitude: number | null;
        longitude: number | null;
        occurredAt: Date;
        incidentPlan: string | null;
        createdAt: Date;
        updatedAt: Date;
        isEscalated: boolean;
        escalatedAt: Date | null;
        escalationReason: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        buildingId: string;
        departmentId: string | null;
        reportedById: string;
    }>;
    escalate(req: Request, id: string, body: {
        assignedToId: string;
        reason: string;
    }): Promise<any>;
    uploadEvidence(req: Request, id: string, body: any): Promise<{
        fileUrl: string;
        id: string;
        fileType: string;
        uploaderRole: string | null;
        uploadedAt: Date;
        uploadedById: string | null;
        incidentId: string;
    }>;
    listEvidence(id: string): Promise<{
        fileUrl: string;
        id: string;
        fileType: string;
        uploaderRole: string | null;
        uploadedAt: Date;
        uploadedById: string | null;
        incidentId: string;
    }[]>;
    addCorrectiveAction(id: string, body: {
        actionText: string;
    }): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        incidentId: string;
        actionText: string;
        dueDate: Date | null;
        completedAt: Date | null;
        notes: string | null;
    }>;
    patchCorrectiveAction(id: string, actionId: string, body: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        incidentId: string;
        actionText: string;
        dueDate: Date | null;
        completedAt: Date | null;
        notes: string | null;
    }>;
    addApproval(req: Request, id: string, body: any): Promise<any>;
    putApproval(id: string, approvalId: string, body: any): Promise<any>;
    postApprovalAttachment(id: string, approvalId: string, body: any): Promise<{
        fileUrl: string;
        id: string;
        createdAt: Date;
        fileType: string | null;
        fileName: string | null;
        approvalId: string;
    }>;
    deleteApprovalAttachment(id: string, approvalId: string, attachmentId: string): Promise<{
        ok: boolean;
    }>;
    deleteApproval(id: string, approvalId: string): Promise<{
        ok: boolean;
    }>;
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
        category: string;
        type: string;
        description: string;
        user: {
            id: string;
            name: string;
            email?: string;
        } | undefined;
        timestamp: string;
    }[]>;
    addActivity(req: Request, id: string, body: any): Promise<void>;
    close(req: Request, id: string): Promise<{
        id: string;
        incidentNumber: string;
        type: string | null;
        description: string;
        category: string;
        severity: string;
        immediateActions: string | null;
        otherActions: string | null;
        impact: string | null;
        location: string | null;
        peopleImpacted: number | null;
        status: import("@prisma/client").$Enums.IncidentStatus;
        latitude: number | null;
        longitude: number | null;
        occurredAt: Date;
        incidentPlan: string | null;
        createdAt: Date;
        updatedAt: Date;
        isEscalated: boolean;
        escalatedAt: Date | null;
        escalationReason: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        buildingId: string;
        departmentId: string | null;
        reportedById: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        incidentNumber: string;
        type: string | null;
        description: string;
        category: string;
        severity: string;
        immediateActions: string | null;
        otherActions: string | null;
        impact: string | null;
        location: string | null;
        peopleImpacted: number | null;
        status: import("@prisma/client").$Enums.IncidentStatus;
        latitude: number | null;
        longitude: number | null;
        occurredAt: Date;
        incidentPlan: string | null;
        createdAt: Date;
        updatedAt: Date;
        isEscalated: boolean;
        escalatedAt: Date | null;
        escalationReason: string | null;
        isActive: boolean;
        deletedAt: Date | null;
        buildingId: string;
        departmentId: string | null;
        reportedById: string;
    }>;
}
