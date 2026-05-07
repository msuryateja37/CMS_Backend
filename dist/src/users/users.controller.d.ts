import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    list(page?: string, pageSize?: string): Promise<{
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
}
export declare class UsersPublicController {
    private readonly usersService;
    constructor(usersService: UsersService);
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
    listFiltered(provinceId?: string, departmentId?: string, role?: string): Promise<{
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
