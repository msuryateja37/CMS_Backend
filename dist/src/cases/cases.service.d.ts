import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../system/storage.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class CasesService {
    private readonly prisma;
    private readonly storage;
    private readonly notifications;
    constructor(prisma: PrismaService, storage: StorageService, notifications: NotificationsService);
    create(userId: string, body: any): Promise<{
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
    getById(idOrNumber: string): Promise<any>;
    assign(id: string, assignedToId: string, assignedById: string): Promise<any>;
    update(id: string, body: any, userId?: string): Promise<{
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
    updateStatus(id: string, status: any, userId?: string): Promise<{
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
    escalate(id: string, userId: string, body: {
        assignedToId: string;
        reason: string;
    }): Promise<any>;
    addEvidence(caseId: string, uploadedById: string, body: any): Promise<{
        fileUrl: string;
        id: string;
        fileType: string;
        uploaderRole: string | null;
        uploadedAt: Date;
        uploadedById: string | null;
        incidentId: string;
    }>;
    listEvidence(caseId: string): Promise<{
        fileUrl: string;
        id: string;
        fileType: string;
        uploaderRole: string | null;
        uploadedAt: Date;
        uploadedById: string | null;
        incidentId: string;
    }[]>;
    addCorrectiveAction(incidentId: string, actionText: string): Promise<{
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
    updateCorrectiveAction(incidentId: string, actionId: string, body: {
        actionText?: string;
        status?: string;
        dueDate?: string | null;
        notes?: string | null;
        completedAt?: string | null;
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
    private signApprovalRecord;
    private assertCorrectiveActionOnIncident;
    private assertApprovalOnIncident;
    addApproval(incidentId: string, body: any, uploadedById: string): Promise<any>;
    updateApproval(incidentId: string, approvalId: string, body: any): Promise<any>;
    addApprovalAttachment(incidentId: string, approvalId: string, body: any): Promise<{
        fileUrl: string;
        id: string;
        createdAt: Date;
        fileType: string | null;
        fileName: string | null;
        approvalId: string;
    }>;
    deleteApprovalAttachment(incidentId: string, approvalId: string, attachmentId: string): Promise<{
        ok: boolean;
    }>;
    deleteApproval(incidentId: string, approvalId: string): Promise<{
        ok: boolean;
    }>;
    close(id: string, userId: string): Promise<{
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
    listCategories(): Promise<{
        id: string;
        name: string;
    }[]>;
    createCategory(_body: any): Promise<{
        message: string;
    }>;
    updateCategory(_id: string, _body: any): Promise<{}>;
    deleteCategory(_id: string): Promise<{}>;
    softDelete(id: string): Promise<{
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
    createEscalationConfig(_caseId: string, _body: any): Promise<{}>;
    getEscalationConfig(_caseId: string): Promise<{}>;
    updateEscalationConfig(_caseId: string, _body: any): Promise<{}>;
    addActivity(incidentId: string, status: any, comments: string, changedById?: string): Promise<void>;
    private transformIncident;
    addComment(incidentId: string, userId: string, comment: string): Promise<{
        id: string;
        comment: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
        createdAt: Date;
    }>;
    getComments(incidentId: string): Promise<{
        id: string;
        comment: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
        createdAt: Date;
    }[]>;
    private appendIncidentTimeline;
    private parseTimelinePayload;
    getActivityTimeline(idOrNumber: string): Promise<{
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
    getEmployeeStats(userId: string): Promise<{
        activeCases: number;
        pendingActions: number;
        resolvedCases: number;
        activeCasesChange: string;
        pendingActionsChange: string;
        resolvedCasesChange: string;
    }>;
    getUpcomingHearings(_userId: string): Promise<never[]>;
}
