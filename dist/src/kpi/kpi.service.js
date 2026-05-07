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
exports.KpiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let KpiService = class KpiService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(body) {
        if (!body?.name)
            throw new common_1.BadRequestException('name is required');
        return this.prisma.kpi.create({
            data: {
                name: body.name,
                targetValue: body.targetValue,
                frequency: body.frequency,
                unit: body.unit ?? 'Count',
            },
        });
    }
    list() {
        return this.prisma.kpi.findMany({
            include: { records: true },
            orderBy: { name: 'asc' },
        });
    }
    record(body) {
        if (!body?.kpiId)
            throw new common_1.BadRequestException('kpiId is required');
        return this.prisma.kpiRecord.create({
            data: {
                kpiId: body.kpiId,
                value: body.value ?? body.actualValue,
                period: body.period ?? 'Monthly',
                recordedAt: body.recordedAt ? new Date(body.recordedAt) : new Date(),
            },
        });
    }
    async getDashboardMetrics() {
        const totalCases = await this.prisma.incident.count();
        const activeCases = await this.prisma.incident.count({
            where: { status: { not: 'CLOSED' } },
        });
        const escalatedCases = await this.prisma.incident.count({
            where: { severity: 'Critical' },
        });
        const closedCases = await this.prisma.incident.count({
            where: { status: 'CLOSED' },
        });
        const avgResponseTime = 0;
        return {
            totalCases,
            activeCases,
            escalatedCases,
            closedCases,
            avgResponseTime,
            activeAssignmentsCount: activeCases,
            escalatedCasesCount: escalatedCases,
            closureRate: totalCases > 0
                ? Number(((closedCases / totalCases) * 100).toFixed(2))
                : 0,
        };
    }
    async getMetricsByProvince(provinceId) {
        const where = { building: { provinceId } };
        const totalCases = await this.prisma.incident.count({ where });
        const activeCases = await this.prisma.incident.count({
            where: { ...where, status: { not: 'CLOSED' } },
        });
        const escalatedCases = await this.prisma.incident.count({
            where: { ...where, severity: 'Critical' },
        });
        return {
            provinceId,
            totalCases,
            activeCases,
            escalatedCases,
            closureRate: totalCases > 0
                ? Number((((totalCases - activeCases) / totalCases) * 100).toFixed(2))
                : 0,
        };
    }
    async getMetricsByBuilding(buildingId) {
        const where = { buildingId };
        const totalCases = await this.prisma.incident.count({ where });
        const activeCases = await this.prisma.incident.count({
            where: { ...where, status: { not: 'CLOSED' } },
        });
        const escalatedCases = await this.prisma.incident.count({
            where: { ...where, severity: 'Critical' },
        });
        return {
            buildingId,
            totalCases,
            activeCases,
            escalatedCases,
            closureRate: totalCases > 0
                ? Number((((totalCases - activeCases) / totalCases) * 100).toFixed(2))
                : 0,
        };
    }
    async getMetricsByCategory(category) {
        const where = { category };
        const totalCases = await this.prisma.incident.count({ where });
        const activeCases = await this.prisma.incident.count({
            where: { ...where, status: { not: 'CLOSED' } },
        });
        const escalatedCases = await this.prisma.incident.count({
            where: { ...where, severity: 'Critical' },
        });
        return {
            categoryId: category,
            totalCases,
            activeCases,
            escalatedCases,
            closureRate: totalCases > 0
                ? Number((((totalCases - activeCases) / totalCases) * 100).toFixed(2))
                : 0,
        };
    }
    async getMetricsByPriority() {
        const severities = ['Critical', 'High', 'Medium', 'Low'];
        const metrics = {};
        for (const severity of severities) {
            const totalCases = await this.prisma.incident.count({
                where: { severity },
            });
            const activeCases = await this.prisma.incident.count({
                where: {
                    severity,
                    status: { not: 'CLOSED' },
                },
            });
            const escalatedCases = await this.prisma.incident.count({
                where: {
                    severity,
                },
            });
            metrics[severity] = {
                totalCases,
                activeCases,
                escalatedCases,
                closureRate: totalCases > 0
                    ? Number((((totalCases - activeCases) / totalCases) * 100).toFixed(2))
                    : 0,
            };
        }
        return metrics;
    }
};
exports.KpiService = KpiService;
exports.KpiService = KpiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KpiService);
//# sourceMappingURL=kpi.service.js.map