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
exports.OhsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OhsService = class OhsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    createRisk(userId, body) {
        if (!body?.title)
            throw new common_1.BadRequestException('title is required');
        return this.prisma.riskRegister.create({
            data: {
                title: body.title,
                description: body.description,
                riskLevel: body.riskLevel,
                departmentId: body.departmentId,
                createdById: userId,
            },
        });
    }
    listRisks() {
        return this.prisma.riskRegister.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    createJsa(userId, body) {
        if (!body?.jobName)
            throw new common_1.BadRequestException('jobName is required');
        return this.prisma.jsa.create({
            data: {
                jobName: body.jobName,
                hazards: body.hazards,
                controls: body.controls,
                remarks: body.remarks,
                createdById: userId,
            },
        });
    }
    scheduleInspection(body) {
        if (!body?.type)
            throw new common_1.BadRequestException('type is required');
        return this.prisma.inspection.create({
            data: {
                type: body.type,
                buildingId: body.buildingId,
                inspectorId: body.inspectorId,
                status: body.status ?? 'SCHEDULED',
                conductedAt: body.conductedAt ? new Date(body.conductedAt) : undefined,
            },
        });
    }
    async submitInspection(id, body) {
        return this.prisma.inspection.update({
            where: { id },
            data: {
                status: body.status ?? 'SUBMITTED',
                conductedAt: body.conductedAt ? new Date(body.conductedAt) : new Date(),
            },
        });
    }
    listInspections(buildingId) {
        return this.prisma.inspection.findMany({
            where: buildingId ? { buildingId } : undefined,
            orderBy: { conductedAt: 'desc' },
            include: { findings: true },
        });
    }
    addFinding(body) {
        if (!body?.inspectionId || !body?.finding)
            throw new common_1.BadRequestException('inspectionId and finding are required');
        return this.prisma.inspectionFinding.create({
            data: {
                inspectionId: body.inspectionId,
                finding: body.finding,
                actionRequired: body.actionRequired,
                dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
                status: body.status ?? 'OPEN',
            },
        });
    }
    closeFinding(id) {
        return this.prisma.inspectionFinding.update({
            where: { id },
            data: { status: 'CLOSED' },
        });
    }
    async listHazards() {
        return this.prisma.incident.findMany({
            where: { type: 'HAZARD' },
            include: { building: true, reportedBy: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async listJsa() {
        return this.prisma.jsa.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async listSwp() {
        return [];
    }
    async getStats() {
        const [total, open, closed] = await Promise.all([
            this.prisma.incident.count({ where: { type: 'HAZARD' } }),
            this.prisma.incident.count({
                where: { type: 'HAZARD', status: 'RAISED' },
            }),
            this.prisma.incident.count({
                where: { type: 'HAZARD', status: { in: ['COMPLETED', 'CLOSED'] } },
            }),
        ]);
        return { total, open, closed };
    }
};
exports.OhsService = OhsService;
exports.OhsService = OhsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OhsService);
//# sourceMappingURL=ohs.service.js.map