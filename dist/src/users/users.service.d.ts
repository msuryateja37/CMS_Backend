import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        departmentId: string | null;
        provinceId: string | null;
        createdAt: Date;
        isActive: boolean;
        roles: ({
            role: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            userId: string;
            roleId: string;
        })[];
    }>;
    list(opts: {
        page: number;
        pageSize: number;
    }): Promise<{
        page: number;
        pageSize: number;
        total: number;
        items: {
            id: string;
            name: string;
            email: string;
            departmentId: string | null;
            provinceId: string | null;
            createdAt: Date;
            isActive: boolean;
            roles: ({
                role: {
                    id: string;
                    name: string;
                    description: string | null;
                };
            } & {
                userId: string;
                roleId: string;
            })[];
        }[];
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        departmentId: string | null;
        provinceId: string | null;
        isActive: boolean;
        roles: ({
            role: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            userId: string;
            roleId: string;
        })[];
    }>;
    findById(id: string): Promise<{
        roles: ({
            role: {
                id: string;
                name: string;
                description: string | null;
            };
        } & {
            userId: string;
            roleId: string;
        })[];
    } & {
        id: string;
        name: string;
        email: string;
        phone: string | null;
        employeeNumber: string | null;
        departmentId: string | null;
        provinceId: string | null;
        createdAt: Date;
        isActive: boolean;
        lastLoginAt: Date | null;
        deletedAt: Date | null;
    }>;
    listByProvince(provinceId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        employeeNumber: string | null;
        departmentId: string | null;
        provinceId: string | null;
        department: {
            id: string;
            name: string;
        } | null;
    }[]>;
    listFiltered(query: {
        provinceId?: string;
        departmentId?: string;
        role?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        employeeNumber: string | null;
        departmentId: string | null;
        provinceId: string | null;
        department: {
            id: string;
            name: string;
        } | null;
        province: {
            id: string;
            name: string;
        } | null;
        ticketCount: number;
    }[]>;
}
