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
exports.EmergencyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EmergencyService = class EmergencyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    createPlan(body) {
        if (!body?.title)
            throw new common_1.BadRequestException('title is required');
        return this.prisma.emergencyPlan.create({
            data: {
                title: body.title,
                version: body.version ?? '1.0',
                documentPath: body.documentPath,
                fileUrl: body.fileUrl,
            },
        });
    }
    listPlans() {
        return this.prisma.emergencyPlan.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    registerEquipment(body) {
        if (!body?.name)
            throw new common_1.BadRequestException('name is required');
        return this.prisma.equipment.create({
            data: {
                name: body.name,
                type: body.type ?? 'General',
                buildingId: body.buildingId,
                status: body.status ?? 'OPERATIONAL',
                lastChecked: body.lastChecked ? new Date(body.lastChecked) : undefined,
            },
        });
    }
    listEquipment() {
        return this.prisma.equipment.findMany({ orderBy: { name: 'asc' } });
    }
    recordDrill(body) {
        if (!body?.name)
            throw new common_1.BadRequestException('name is required');
        if (!body?.type)
            throw new common_1.BadRequestException('type is required');
        return this.prisma.drill.create({
            data: {
                name: body.name,
                type: body.type,
                status: body.status ?? 'SCHEDULED',
                buildingId: body.buildingId,
                scheduledDate: body.scheduledDate
                    ? new Date(body.scheduledDate)
                    : new Date(),
            },
        });
    }
    listDrills() {
        return this.prisma.drill.findMany({ orderBy: { scheduledDate: 'asc' } });
    }
};
exports.EmergencyService = EmergencyService;
exports.EmergencyService = EmergencyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmergencyService);
//# sourceMappingURL=emergency.service.js.map