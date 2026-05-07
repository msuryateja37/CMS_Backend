import { PrismaService } from '../prisma/prisma.service';
export declare class SystemService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAdminStats(): Promise<{
        userCount: number;
        buildingCount: number;
        roleCount: number;
        categoryCount: number;
    }>;
    listRoles(): Promise<({
        _count: {
            users: number;
        };
        permissions: ({
            permission: {
                id: string;
                name: string;
                module: string;
            };
        } & {
            roleId: string;
            permissionId: string;
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
    })[]>;
    createRole(name: string, description?: string): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    updateRole(id: string, name: string, description?: string): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    deleteRole(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    listPermissions(): Promise<{
        id: string;
        name: string;
        module: string;
    }[]>;
    createPermission(name: string, module: string): Promise<{
        id: string;
        name: string;
        module: string;
    }>;
    assignPermissionToRole(roleId: string, permissionId: string): Promise<{
        roleId: string;
        permissionId: string;
    } | undefined>;
    removePermissionFromRole(roleId: string, permissionId: string): Promise<{
        roleId: string;
        permissionId: string;
    }>;
    syncRolePermissions(roleId: string, permissionIds: string[]): Promise<void>;
}
