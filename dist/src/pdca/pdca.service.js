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
exports.PdcaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PdcaService = class PdcaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(body) {
        if (!body?.phase)
            throw new common_1.BadRequestException('phase is required');
        return this.prisma.pdcaAction.create({
            data: {
                title: body.title || 'Untitled Action',
                phase: body.phase,
                description: body.description,
                ownerId: body.ownerId,
                status: body.status ?? 'Pending',
            },
        });
    }
    update(id, body) {
        return this.prisma.pdcaAction.update({
            where: { id },
            data: {
                phase: body.phase,
                description: body.description,
                ownerId: body.ownerId,
                status: body.status,
            },
        });
    }
    list() {
        return this.prisma.pdcaAction.findMany({ orderBy: { createdAt: 'desc' } });
    }
};
exports.PdcaService = PdcaService;
exports.PdcaService = PdcaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PdcaService);
//# sourceMappingURL=pdca.service.js.map