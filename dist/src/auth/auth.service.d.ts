import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    private signAccessToken;
    private signRefreshToken;
    login(email: string, _password: string): Promise<{
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
    refresh(_refreshToken: string): Promise<void>;
    logoutAll(_userId: string): Promise<{
        message: string;
    }>;
    updateProfile(userId: string, data: {
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
    getCurrentUser(userId: string): Promise<{
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
