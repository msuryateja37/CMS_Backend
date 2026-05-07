import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            phone: string | null;
            employeeNumber: string | null;
            role: {
                id: string;
                name: string;
            } | null;
            province: {
                id: string;
                name: string;
            } | null;
            department: {
                id: string;
                name: string;
                building: {
                    id: string;
                    name: string;
                    province: {
                        id: string;
                        name: string;
                    } | null;
                } | null;
            } | null;
        };
    }>;
    refresh(dto: RefreshDto): Promise<void>;
    getCurrentUser(req: Request): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        employeeNumber: string | null;
        role: {
            id: string;
            name: string;
        } | null;
        province: {
            id: string;
            name: string;
        } | null;
        department: {
            id: string;
            name: string;
            building: {
                id: string;
                name: string;
                province: {
                    id: string;
                    name: string;
                } | null;
            } | null;
        } | null;
    }>;
    logout(req: Request): Promise<{
        message: string;
    }>;
    updateProfile(req: Request, body: {
        fullName?: string;
        phone?: string;
        provinceId?: string;
        departmentId?: string;
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        phone: string | null;
        employeeNumber: string | null;
        role: {
            id: string;
            name: string;
        } | null;
        province: {
            id: string;
            name: string;
        } | null;
        department: {
            id: string;
            name: string;
            building: {
                id: string;
                name: string;
                province: {
                    id: string;
                    name: string;
                } | null;
            } | null;
        } | null;
    }>;
}
