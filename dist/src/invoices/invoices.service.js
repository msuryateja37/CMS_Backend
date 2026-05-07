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
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InvoicesService = class InvoicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(body) {
        if (!body?.invoiceNumber)
            throw new common_1.BadRequestException('invoiceNumber is required');
        if (body?.amount == null)
            throw new common_1.BadRequestException('amount is required');
        if (!body?.receivedDate)
            throw new common_1.BadRequestException('receivedDate is required');
        return this.prisma.invoice.create({
            data: {
                invoiceNumber: body.invoiceNumber,
                description: body.vendorName
                    ? `Vendor: ${body.vendorName}`
                    : body.description,
                amount: body.amount,
                receivedDate: new Date(body.receivedDate),
                status: 'PENDING',
                taskId: body.taskId,
            },
        });
    }
    list(status) {
        const where = {};
        if (status)
            where.status = status;
        return this.prisma.invoice.findMany({
            where,
            orderBy: { receivedDate: 'desc' },
        });
    }
    async getById(id) {
        const inv = await this.prisma.invoice.findUnique({ where: { id } });
        if (!inv)
            throw new common_1.NotFoundException('Invoice not found');
        return inv;
    }
    async transition(id, newStatus, performedById, note) {
        const invoice = await this.prisma.invoice.findUnique({ where: { id } });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        const validStatus = ['PENDING', 'APPROVED', 'REJECTED'].includes(newStatus)
            ? newStatus
            : 'PENDING';
        if (newStatus === 'REJECTED' && !note)
            throw new common_1.BadRequestException('reason is required');
        const updated = await this.prisma.invoice.update({
            where: { id },
            data: { status: validStatus },
        });
        await this.prisma.invoiceAction.create({
            data: {
                invoiceId: id,
                action: note ? `${newStatus}:${note}` : newStatus,
                actorId: performedById,
            },
        });
        return updated;
    }
    actions(invoiceId) {
        return this.prisma.invoiceAction.findMany({
            where: { invoiceId },
            orderBy: { timestamp: 'desc' },
        });
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map