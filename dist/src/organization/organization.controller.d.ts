import { OrganizationService } from './organization.service';
export declare class OrganizationController {
    private readonly org;
    constructor(org: OrganizationService);
    createProvince(body: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
    listProvinces(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }[]>;
    createBuilding(body: {
        name: string;
        provinceId: string;
        postalCode?: string;
        address?: string;
    }): Promise<{
        id: string;
        name: string;
        provinceId: string;
        createdAt: Date;
        address: string | null;
        postalCode: string | null;
        latitude: number | null;
        longitude: number | null;
    }>;
    listBuildings(provinceId?: string): Promise<{
        id: string;
        name: string;
        provinceId: string;
        createdAt: Date;
        address: string | null;
        postalCode: string | null;
        latitude: number | null;
        longitude: number | null;
    }[]>;
    getBuildingsByProvince(provinceId: string): Promise<{
        id: string;
        name: string;
        provinceId: string;
        createdAt: Date;
        address: string | null;
        postalCode: string | null;
        latitude: number | null;
        longitude: number | null;
    }[]>;
    createDepartment(body: {
        name: string;
        buildingId: string;
    }): Promise<{
        id: string;
        name: string;
        buildingId: string | null;
    }>;
    listDepartments(buildingId?: string): Promise<{
        id: string;
        name: string;
        buildingId: string | null;
    }[]>;
    updateOrg(type: string, id: string, body: any): Promise<{
        id: string;
        name: string;
        buildingId: string | null;
    } | {
        id: string;
        name: string;
        createdAt: Date;
    }>;
}
