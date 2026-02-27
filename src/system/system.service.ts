import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminStats() {
    const [userCount, buildingCount, roleCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.building.count(),
      this.prisma.role.count(),
      // this.prisma.incidentCategory.count(), // Missing model
    ]);
    return {
      userCount,
      buildingCount,
      roleCount,
      categoryCount: 0, // Placeholder
    };
  }

  // --- Roles ---
  async listRoles() {
    return this.prisma.role.findMany({
      include: {
        _count: { select: { users: true } }, // users here refers to UserRole relation, so count is valid
        permissions: { include: { permission: true } }, // Schema has permissions: RolePermission[]
      },
      orderBy: { name: 'asc' },
    });
  }

  async createRole(name: string, description?: string) {
    const exists = await this.prisma.role.findUnique({ where: { name } });
    if (exists) throw new BadRequestException('Role already exists');
    return this.prisma.role.create({ data: { name, description } });
  }

  async updateRole(id: string, name: string, description?: string) {
    return this.prisma.role.update({
      where: { id },
      data: { name, description },
    });
  }

  async deleteRole(id: string) {
    // Check if users are assigned to this role (via UserRole)
    const usersCount = await this.prisma.userRole.count({
      where: { roleId: id },
    });
    if (usersCount > 0)
      throw new BadRequestException('Cannot delete role with assigned users');

    // Delete role permissions first? cascading likely handled by DB or Prisma
    return this.prisma.role.delete({ where: { id } });
  }

  // --- Permissions ---
  async listPermissions() {
    return this.prisma.permission.findMany({ orderBy: { name: 'asc' } });
  }

  async createPermission(name: string, module: string) {
    const exists = await this.prisma.permission.findUnique({ where: { name } });
    if (exists) throw new BadRequestException('Permission already exists');
    return this.prisma.permission.create({ data: { name, module } });
  }

  // --- Role Permissions ---
  // Note: RolePermission composite ID is [roleId, permissionId]
  // Prisma generates a composite key accessor usually like roleId_permissionId

  async assignPermissionToRole(roleId: string, permissionId: string) {
    // Using create directly as upsert on composite might be tricky without correct where input
    // but let's try standard approach
    try {
      return await this.prisma.rolePermission.create({
        data: { roleId, permissionId },
      });
    } catch (_e) {
      // ignore if exists
      return;
    }
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.delete({
      where: { roleId_permissionId: { roleId, permissionId } },
    });
  }

  async syncRolePermissions(roleId: string, permissionIds: string[]) {
    // Transaction to replace permissions
    return this.prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({ where: { roleId } });
      if (permissionIds.length > 0) {
        await tx.rolePermission.createMany({
          data: permissionIds.map((pid) => ({ roleId, permissionId: pid })),
        });
      }
    });
  }
}
