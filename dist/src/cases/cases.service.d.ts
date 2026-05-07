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
    getById(idOrNumber: string): Promise<any>;
    assign(id: string, assignedToId: string, assignedById: string): Promise<any>;
    update(id: string, body: any, userId?: string): Promise<{
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
    updateStatus(id: string, status: any, userId?: string): Promise<{
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
    escalate(id: string, userId: string, body: {
        assignedToId: string;
        reason: string;
    }): Promise<any>;
    addEvidence(caseId: string, uploadedById: string, body: any): Promise<{
        fileUrl: string;
        id: string;
        incidentId: string;
        fileType: string;
        uploaderRole: string | null;
        uploadedAt: Date;
        uploadedById: string | null;
    }>;
    listEvidence(caseId: string): Promise<{
        fileUrl: string;
        id: string;
        incidentId: string;
        fileType: string;
        uploaderRole: string | null;
        uploadedAt: Date;
        uploadedById: string | null;
    }[]>;
    close(id: string, userId: string): Promise<{
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
    getActivityTimeline(idOrNumber: string): Promise<{
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
