import { PrismaService } from '../prisma/prisma.service';
export declare class OrganizationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createProvince(name: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }>;
    listProvinces(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
    }[]>;
    createBuilding(input: {
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
    createDepartment(input: {
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
