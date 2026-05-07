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
exports.SystemService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SystemService = class SystemService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdminStats() {
        const [userCount, buildingCount, roleCount] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.building.count(),
            this.prisma.role.count(),
        ]);
        return {
            userCount,
            buildingCount,
            roleCount,
            categoryCount: 0,
        };
    }
    async listRoles() {
        return this.prisma.role.findMany({
            include: {
                _count: { select: { users: true } },
                permissions: { include: { permission: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async createRole(name, description) {
        const exists = await this.prisma.role.findUnique({ where: { name } });
        if (exists)
            throw new common_1.BadRequestException('Role already exists');
        return this.prisma.role.create({ data: { name, description } });
    }
    async updateRole(id, name, description) {
        return this.prisma.role.update({
            where: { id },
            data: { name, description },
        });
    }
    async deleteRole(id) {
        const usersCount = await this.prisma.userRole.count({
            where: { roleId: id },
        });
        if (usersCount > 0)
            throw new common_1.BadRequestException('Cannot delete role with assigned users');
        return this.prisma.role.delete({ where: { id } });
    }
    async listPermissions() {
        return this.prisma.permission.findMany({ orderBy: { name: 'asc' } });
    }
    async createPermission(name, module) {
        const exists = await this.prisma.permission.findUnique({ where: { name } });
        if (exists)
            throw new common_1.BadRequestException('Permission already exists');
        return this.prisma.permission.create({ data: { name, module } });
    }
    async assignPermissionToRole(roleId, permissionId) {
        try {
            return await this.prisma.rolePermission.create({
                data: { roleId, permissionId },
            });
        }
        catch (_e) {
            return;
        }
    }
    async removePermissionFromRole(roleId, permissionId) {
        return this.prisma.rolePermission.delete({
            where: { roleId_permissionId: { roleId, permissionId } },
        });
    }
    async syncRolePermissions(roleId, permissionIds) {
        return this.prisma.$transaction(async (tx) => {
            await tx.rolePermission.deleteMany({ where: { roleId } });
            if (permissionIds.length > 0) {
                await tx.rolePermission.createMany({
                    data: permissionIds.map((pid) => ({ roleId, permissionId: pid })),
                });
            }
        });
    }
};
exports.SystemService = SystemService;
exports.SystemService = SystemService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemService);
//# sourceMappingURL=system.service.js.map