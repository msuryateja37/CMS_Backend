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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const exists = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (exists)
            throw new common_1.BadRequestException('Email already exists');
        return this.prisma.user.create({
            data: {
                name: dto.fullName,
                email: dto.email,
                departmentId: dto.departmentId,
                provinceId: dto.provinceId,
                isActive: dto.isActive ?? true,
                roles: dto.roleId
                    ? {
                        create: {
                            roleId: dto.roleId,
                        },
                    }
                    : undefined,
            },
            select: {
                id: true,
                name: true,
                email: true,
                departmentId: true,
                provinceId: true,
                isActive: true,
                createdAt: true,
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    async list(opts) {
        const page = Number.isFinite(opts.page) && opts.page > 0 ? opts.page : 1;
        const pageSize = Number.isFinite(opts.pageSize) && opts.pageSize > 0
            ? Math.min(opts.pageSize, 100)
            : 20;
        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    departmentId: true,
                    provinceId: true,
                    isActive: true,
                    createdAt: true,
                    roles: {
                        include: {
                            role: true,
                        },
                    },
                },
            }),
            this.prisma.user.count(),
        ]);
        return { page, pageSize, total, items };
    }
    async update(id, dto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: {
                name: dto.fullName,
                departmentId: dto.departmentId,
                provinceId: dto.provinceId,
                isActive: dto.isActive,
                roles: dto.roleId
                    ? {
                        deleteMany: {},
                        create: { roleId: dto.roleId },
                    }
                    : undefined,
            },
            select: {
                id: true,
                name: true,
                email: true,
                departmentId: true,
                provinceId: true,
                isActive: true,
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async listByProvince(provinceId) {
        return this.prisma.user.findMany({
            where: { provinceId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                employeeNumber: true,
                departmentId: true,
                provinceId: true,
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async listFiltered(query) {
        const where = {};
        if (query.provinceId)
            where.provinceId = query.provinceId;
        if (query.departmentId)
            where.departmentId = query.departmentId;
        if (query.role) {
            where.roles = {
                some: {
                    role: {
                        name: query.role,
                    },
                },
            };
        }
        const users = await this.prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                employeeNumber: true,
                departmentId: true,
                provinceId: true,
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                province: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignedIncidents: {
                    where: {
                        incident: {
                            status: {
                                notIn: ['CLOSED', 'COMPLETED'],
                            },
                        },
                    },
                    select: { id: true },
                },
            },
            orderBy: { name: 'asc' },
        });
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            employeeNumber: user.employeeNumber,
            departmentId: user.departmentId,
            provinceId: user.provinceId,
            department: user.department,
            province: user.province,
            ticketCount: user.assignedIncidents.length,
        }));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map