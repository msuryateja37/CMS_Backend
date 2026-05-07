"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_service_1 = require("../system/storage.service");
const notifications_service_1 = require("../notifications/notifications.service");
const client_1 = require("@prisma/client");
let CasesService = class CasesService {
    prisma;
    storage;
    notifications;
    constructor(prisma, storage, notifications) {
        this.prisma = prisma;
        this.storage = storage;
        this.notifications = notifications;
    }
    async create(userId, body) {
        let buildingId = body.buildingId;
        if (!buildingId) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    department: {
                        include: {
                            building: true,
                        },
                    },
                },
            });
            if (user?.department?.building?.id) {
                buildingId = user.department.building.id;
            }
            else {
                throw new common_1.BadRequestException('Building ID is required. User has no associated building in their department.');
            }
        }
        const incidentNumber = body.caseNumber ?? `INC-${Date.now()}`;
        const incident = await this.prisma.incident.create({
            data: {
                id: body.id,
                incidentNumber,
                type: body.type ?? 'INCIDENT',
                category: body.categoryId ?? 'others',
                severity: body.severityLevel ?? body.severity ?? 'medium',
                status: 'RAISED',
                description: body.description ?? '',
                occurredAt: body.occurredAt
                    ? new Date(body.occurredAt)
                    : new Date(),
                reportedById: userId,
                buildingId: buildingId,
                location: body.location,
                latitude: body.latitude
                    ? parseFloat(body.latitude)
                    : undefined,
                longitude: body.longitude
                    ? parseFloat(body.longitude)
                    : undefined,
                immediateActions: body.immediateActions
                    ? JSON.stringify(body.immediateActions)
                    : null,
                otherActions: body.otherActions,
                peopleImpacted: body.peopleImpacted ?? body.impactedPeople?.length ?? 0,
                impactedPeople: body.impactedPeople && body.impactedPeople.length > 0
                    ? {
                        create: body.impactedPeople.map((person) => ({
                            name: person.name,
                            email: person.email,
                            phone: person.phone,
                        })),
                    }
                    : undefined,
                media: body.media && body.media.length > 0
                    ? {
                        create: body.media.map((m) => ({
                            fileUrl: m.url,
                            fileType: m.type || 'unknown',
                            uploaderRole: m.uploaderRole,
                            uploadedBy: m.uploadedById
                                ? { connect: { id: m.uploadedById } }
                                : undefined,
                        })),
                    }
                    : undefined,
            },
            include: {
                reportedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                building: {
                    select: {
                        id: true,
                        name: true,
                        province: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                impactedPeople: true,
                media: true,
            },
        });
        await this.addActivity(incident.id, 'RAISED', 'Incident created', userId);
        const supervisors = await this.prisma.user.findMany({
            where: { roles: { some: { role: { name: 'Supervisor' } } } },
            select: { id: true },
        });
        for (const sup of supervisors) {
            await this.notifications.create(sup.id, 'New Case Reported', `Case ${incidentNumber} has been reported and requires review.`, 'cases', incident.id);
        }
        const sla = await this.prisma.sLA.findFirst({
            where: {
                category: incident.category,
                severity: incident.severity,
            },
        });
        if (sla) {
            const now = new Date();
            await this.prisma.incidentSLATracking.create({
                data: {
                    incidentId: incident.id,
                    slaId: sla.id,
                    responseDueAt: new Date(now.getTime() + sla.responseMinutes * 60 * 1000),
                    resolutionDueAt: new Date(now.getTime() + sla.resolutionMinutes * 60 * 1000),
                },
            });
        }
        return incident;
    }
    async list(query) {
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.buildingId)
            where.buildingId = query.buildingId;
        if (query.reported_by)
            where.reportedById = query.reported_by;
        if (query.type)
            where.type = query.type;
        if (query.priorityLevel || query.severity) {
            where.severity = {
                equals: query.priorityLevel || query.severity,
                mode: 'insensitive',
            };
        }
        if (query.categoryId)
            where.category = { equals: query.categoryId, mode: 'insensitive' };
        if (query.isEscalated === 'true')
            where.isEscalated = true;
        if (query.assignedToId) {
            where.assignments = {
                some: {
                    assignedToId: query.assignedToId,
                },
            };
        }
        const take = query.take ? Number(query.take) : 50;
        const skip = query.skip ? Number(query.skip) : 0;
        const [incidents, total] = await Promise.all([
            this.prisma.incident.findMany({
                where,
                include: {
                    reportedBy: true,
                    building: true,
                    assignments: {
                        include: { assignedTo: true },
                        orderBy: { assignedAt: 'desc' },
                        take: 1,
                    },
                },
                orderBy: { createdAt: 'desc' },
                take,
                skip,
            }),
            this.prisma.incident.count({ where }),
        ]);
        return {
            data: incidents.map((i) => this.transformIncident(i)),
            total,
        };
    }
    async getById(idOrNumber) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrNumber);
        const where = isUuid ? { id: idOrNumber } : { incidentNumber: idOrNumber };
        const c = await this.prisma.incident.findFirst({
            where,
            include: {
                reportedBy: true,
                building: {
                    include: {
                        province: true,
                    },
                },
                department: true,
                media: {
                    include: {
                        uploadedBy: true,
                    },
                },
                statusLogs: {
                    include: {
                        changedBy: true,
                    },
                    orderBy: { changedAt: 'desc' },
                },
                assignments: {
                    include: { assignedTo: true },
                    orderBy: { assignedAt: 'desc' },
                    take: 1,
                },
                comments: {
                    include: {
                        commentedBy: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });
        if (!c)
            throw new common_1.NotFoundException('Case not found');
        return this.transformIncident(c);
    }
    async assign(id, assignedToId, assignedById) {
        if (!assignedToId)
            throw new common_1.BadRequestException('assignedToId is required');
        const assignedUser = await this.prisma.user.findUnique({
            where: { id: assignedToId },
            select: { name: true },
        });
        await this.prisma.incidentAssignment.create({
            data: {
                incidentId: id,
                assignedToId: assignedToId,
                assignedById: assignedById,
            },
        });
        await this.prisma.incident.update({
            where: { id },
            data: { status: 'ASSIGNED' },
        });
        await this.addActivity(id, 'ASSIGNED', `Assigned to ${assignedUser?.name ?? 'practitioner'}`, assignedById);
        const incident = await this.prisma.incident.findUnique({
            where: { id },
            select: { incidentNumber: true },
        });
        await this.notifications.create(assignedToId, 'Case Assigned to You', `Case ${incident?.incidentNumber ?? id} has been assigned to you for investigation.`, 'cases', id);
        return this.getById(id);
    }
    async update(id, body, userId) {
        const updateData = {};
        if (body.severity)
            updateData.severity = body.severity;
        if (body.status)
            updateData.status = body.status;
        if (body.description)
            updateData.description = body.description;
        if (body.buildingId)
            updateData.buildingId = body.buildingId;
        if (body.departmentId)
            updateData.departmentId = body.departmentId;
        const incident = await this.prisma.incident.update({
            where: { id },
            data: updateData,
            include: {
                department: true,
                building: true,
            },
        });
        if (userId) {
            if (body.status) {
                await this.addActivity(id, body.status, `Status updated to ${body.status}`, userId);
            }
            if (body.departmentId && incident.department) {
                await this.addActivity(id, incident.status, `Assigned to department: ${incident.department.name}`, userId);
            }
        }
        return incident;
    }
    async updateStatus(id, status, userId) {
        const incident = await this.prisma.incident.update({
            where: { id },
            data: { status },
        });
        if (userId) {
            await this.addActivity(id, status, `Status updated to ${status}`, userId);
        }
        if (status === 'UNDER_REVIEW') {
            const lastAssignment = await this.prisma.incidentAssignment.findFirst({
                where: { incidentId: id },
                orderBy: { assignedAt: 'desc' },
                include: { assignedBy: { select: { id: true, name: true } } },
            });
            if (lastAssignment?.assignedBy) {
                await this.notifications.create(lastAssignment.assignedBy.id, 'Case Submitted for Review', `Case ${incident.incidentNumber} has been submitted back for your review.`, 'cases', id);
            }
        }
        return incident;
    }
    async escalate(id, userId, body) {
        const { assignedToId, reason } = body;
        if (!assignedToId)
            throw new common_1.BadRequestException('assignedToId is required');
        if (!reason)
            throw new common_1.BadRequestException('Escalation reason is required');
        const escalatingUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true },
        });
        await this.prisma.incident.update({
            where: { id },
            data: {
                isEscalated: true,
                escalatedAt: new Date(),
                escalationReason: reason,
            },
        });
        await this.prisma.incidentAssignment.create({
            data: {
                incidentId: id,
                assignedToId,
                assignedById: userId,
            },
        });
        await this.addActivity(id, 'ASSIGNED', `Case escalated by ${escalatingUser?.name ?? 'Unknown'}: ${reason}`, userId);
        const incident = await this.prisma.incident.findUnique({
            where: { id },
            select: { incidentNumber: true },
        });
        await this.notifications.create(assignedToId, 'Case Escalated to You', `Case ${incident?.incidentNumber ?? id} has been escalated to you by ${escalatingUser?.name ?? 'a colleague'}. Reason: ${reason}`, 'cases', id);
        return this.getById(id);
    }
    async addEvidence(caseId, uploadedById, body) {
        const media = await this.prisma.incidentMedia.create({
            data: {
                incidentId: caseId,
                fileUrl: body.fileUrl ?? body.storagePath ?? body.path ?? body.url,
                fileType: body.fileType ?? 'unknown',
                uploaderRole: body.uploaderRole,
                uploadedById: uploadedById,
            },
        });
        return {
            ...media,
            fileUrl: this.storage.getAuthenticatedUrl(media.fileUrl),
        };
    }
    async listEvidence(caseId) {
        const evidence = await this.prisma.incidentMedia.findMany({
            where: { incidentId: caseId },
            orderBy: { uploadedAt: 'desc' },
        });
        return evidence.map((e) => ({
            ...e,
            fileUrl: this.storage.getAuthenticatedUrl(e.fileUrl),
        }));
    }
    async close(id, userId) {
        await this.addActivity(id, 'CLOSED', 'Closed by user ' + userId, userId);
        return this.updateStatus(id, 'CLOSED');
    }
    async listCategories() {
        const cats = await this.prisma.incident.findMany({
            distinct: ['category'],
            select: { category: true },
        });
        return cats.map((c) => ({ id: c.category, name: c.category }));
    }
    async createCategory(_body) {
        await Promise.resolve();
        return { message: 'Categories are dynamic' };
    }
    async updateCategory(_id, _body) {
        await Promise.resolve();
        return {};
    }
    async deleteCategory(_id) {
        await Promise.resolve();
        return {};
    }
    async softDelete(id) {
        return this.prisma.incident.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async createEscalationConfig(_caseId, _body) {
        await Promise.resolve();
        return {};
    }
    async getEscalationConfig(_caseId) {
        await Promise.resolve();
        return {};
    }
    async updateEscalationConfig(_caseId, _body) {
        await Promise.resolve();
        return {};
    }
    async addActivity(incidentId, status, comments, changedById) {
        if (!changedById)
            return;
        let newStatus = client_1.IncidentStatus.RAISED;
        const statusUpper = typeof status === 'string' ? status.toUpperCase() : status;
        if (Object.values(client_1.IncidentStatus).includes(statusUpper)) {
            newStatus = statusUpper;
        }
        const incident = await this.prisma.incident.findUnique({
            where: { id: incidentId },
            select: { status: true },
        });
        await this.prisma.incidentStatusLog.create({
            data: {
                incidentId,
                newStatus: newStatus,
                oldStatus: incident?.status || client_1.IncidentStatus.RAISED,
                comments: comments || '',
                userId: changedById,
            },
        });
    }
    transformIncident(incident) {
        if (!incident)
            return incident;
        const media = incident.media
            ? incident.media.map((m) => ({
                ...m,
                fileUrl: this.storage.getAuthenticatedUrl(m.fileUrl),
            }))
            : [];
        const assignedTo = incident.assignments && incident.assignments.length > 0
            ? incident.assignments[0].assignedTo
            : undefined;
        const comments = incident.comments
            ? incident.comments.map((c) => ({
                id: c.id,
                comment: c.comment,
                user: c.commentedBy ?? { id: c.userId, name: 'Unknown' },
                createdAt: c.createdAt,
            }))
            : [];
        return {
            ...incident,
            media,
            evidence: media,
            assignedTo,
            comments,
        };
    }
    async addComment(incidentId, userId, comment) {
        if (!comment?.trim())
            throw new common_1.BadRequestException('Comment is required');
        const created = await this.prisma.incidentComment.create({
            data: {
                incidentId,
                userId,
                comment: comment.trim(),
            },
            include: {
                commentedBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        return {
            id: created.id,
            comment: created.comment,
            user: created.commentedBy,
            createdAt: created.createdAt,
        };
    }
    async getComments(incidentId) {
        const comments = await this.prisma.incidentComment.findMany({
            where: { incidentId },
            include: {
                commentedBy: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        return comments.map((c) => ({
            id: c.id,
            comment: c.comment,
            user: c.commentedBy,
            createdAt: c.createdAt,
        }));
    }
    async getActivityTimeline(idOrNumber) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrNumber);
        let incidentId = idOrNumber;
        if (!isUuid) {
            const incident = await this.prisma.incident.findUnique({
                where: { incidentNumber: idOrNumber },
                select: { id: true },
            });
            if (!incident)
                throw new common_1.NotFoundException('Case not found');
            incidentId = incident.id;
        }
        const logs = await this.prisma.incidentStatusLog.findMany({
            where: { incidentId },
            include: {
                changedBy: {
                    select: { id: true, name: true, email: true },
                },
            },
            orderBy: { changedAt: 'asc' },
        });
        return logs.map((log) => ({
            id: log.id,
            type: log.newStatus,
            oldStatus: log.oldStatus,
            newStatus: log.newStatus,
            description: log.comments ?? '',
            user: log.changedBy,
            timestamp: log.changedAt,
        }));
    }
    async getSlaTracking() {
        const trackings = await this.prisma.incidentSLATracking.findMany({
            include: {
                incident: {
                    select: {
                        id: true,
                        incidentNumber: true,
                        category: true,
                        severity: true,
                        status: true,
                        createdAt: true,
                        isEscalated: true,
                        assignments: {
                            include: { assignedTo: { select: { id: true, name: true } } },
                            orderBy: { assignedAt: 'desc' },
                            take: 1,
                        },
                    },
                },
                sla: true,
            },
            orderBy: { resolutionDueAt: 'asc' },
        });
        const now = new Date();
        return trackings.map((t) => {
            const responseHoursLeft = (t.responseDueAt.getTime() - now.getTime()) / (1000 * 60 * 60);
            const resolutionHoursLeft = (t.resolutionDueAt.getTime() - now.getTime()) / (1000 * 60 * 60);
            const totalResolutionHours = t.sla.resolutionMinutes / 60;
            const elapsedHours = totalResolutionHours - resolutionHoursLeft;
            const progress = Math.min(100, Math.max(0, (elapsedHours / totalResolutionHours) * 100));
            let slaStatus;
            if (t.resolutionBreached || resolutionHoursLeft < 0) {
                slaStatus = 'breached';
            }
            else if (resolutionHoursLeft < totalResolutionHours * 0.25) {
                slaStatus = 'warning';
            }
            else {
                slaStatus = 'on-track';
            }
            return {
                id: t.id,
                incidentId: t.incident.id,
                incidentNumber: t.incident.incidentNumber,
                category: t.incident.category,
                severity: t.incident.severity,
                status: t.incident.status,
                isEscalated: t.incident.isEscalated,
                assignedTo: t.incident.assignments[0]?.assignedTo ?? null,
                responseDueAt: t.responseDueAt,
                resolutionDueAt: t.resolutionDueAt,
                responseBreached: t.responseBreached,
                resolutionBreached: t.resolutionBreached,
                responseHoursLeft: Math.round(responseHoursLeft * 10) / 10,
                resolutionHoursLeft: Math.round(resolutionHoursLeft * 10) / 10,
                totalResolutionHours,
                progress: Math.round(progress),
                slaStatus,
            };
        });
    }
    async getKpiMetrics() {
        const total = await this.prisma.incident.count();
        return {
            totalCases: total,
            openCases: 0,
            inProgressCases: 0,
            escalatedCases: 0,
            closedCases: 0,
            activeCases: 0,
            avgResponseTime: 0,
            closureRate: 0,
        };
    }
    async getEmployeeStats(userId) {
        const total = await this.prisma.incident.count({
            where: { reportedById: userId },
        });
        return {
            activeCases: total,
            pendingActions: 0,
            resolvedCases: 0,
            activeCasesChange: '0%',
            pendingActionsChange: '0%',
            resolvedCasesChange: '0%',
        };
    }
    async getUpcomingHearings(_userId) {
        await Promise.resolve();
        return [];
    }
};
exports.CasesService = CasesService;
exports.CasesService = CasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        storage_service_1.StorageService,
        notifications_service_1.NotificationsService])
], CasesService);
//# sourceMappingURL=cases.service.js.map