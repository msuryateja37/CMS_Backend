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
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SyncService = class SyncService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async push(userId, body) {
        const items = Array.isArray(body?.items) ? body.items : [];
        const created = await Promise.all(items.map((i) => this.prisma.syncQueue.create({
            data: {
                userId,
                entity: i.entity,
                entityId: i.entityId,
                action: i.operation ?? 'Unknown',
                payload: i.payload ?? {},
                status: 'PENDING',
            },
        })));
        return { status: 'ok', queued: created.length };
    }
    pull(since) {
        const sinceDate = since ? new Date(since) : undefined;
        return this.prisma.syncQueue.findMany({
            where: sinceDate ? { createdAt: { gt: sinceDate } } : undefined,
            orderBy: { createdAt: 'asc' },
            take: 200,
        });
    }
    async resolve(body) {
        if (!body?.id || !body?.status)
            throw new common_1.BadRequestException('id and status are required');
        return this.prisma.syncQueue.update({
            where: { id: body.id },
            data: { status: body.status },
        });
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SyncService);
//# sourceMappingURL=sync.service.js.map