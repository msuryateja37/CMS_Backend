import { SystemService } from './system.service';
export declare class SystemController {
    private readonly system;
    constructor(system: SystemService);
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
    createRole(body: {
        name: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    updateRole(id: string, body: {
        name: string;
        description?: string;
    }): Promise<{
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
    createPermission(body: {
        code: string;
        description?: string;
    }): Promise<{
        id: string;
        name: string;
        module: string;
    }>;
    syncRolePermissions(id: string, body: {
        permissionIds: string[];
    }): Promise<void>;
}
