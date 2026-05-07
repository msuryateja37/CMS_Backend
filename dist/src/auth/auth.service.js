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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async signAccessToken(payload) {
        return this.jwt.signAsync(payload);
    }
    async signRefreshToken(payload) {
        const secret = this.config.get('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret';
        const expiresIn = this.config.get('JWT_REFRESH_EXPIRES_IN') ?? '1d';
        return this.jwt.signAsync(payload, {
            secret,
            expiresIn: expiresIn,
        });
    }
    async login(email, _password) {
        console.log(`Login attempt for email: ${email}`);
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
                department: {
                    include: {
                        building: {
                            include: {
                                province: true,
                            },
                        },
                    },
                },
                province: true,
            },
        });
        if (!user) {
            console.log(`User not found: ${email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            console.log(`User inactive: ${email}`);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        console.log(`Login successful for: ${email}`);
        const primaryRole = user.roles.length > 0 ? user.roles[0].role : null;
        const accessToken = await this.signAccessToken({
            sub: user.id,
            role: primaryRole?.name,
        });
        const refreshToken = 'feature_disabled_in_schema';
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.name,
                phone: user.phone,
                employeeNumber: user.employeeNumber,
                role: primaryRole
                    ? {
                        id: primaryRole.id,
                        name: primaryRole.name,
                    }
                    : null,
                province: user.province
                    ? {
                        id: user.province.id,
                        name: user.province.name,
                    }
                    : null,
                department: user.department
                    ? {
                        id: user.department.id,
                        name: user.department.name,
                        building: user.department.building
                            ? {
                                id: user.department.building.id,
                                name: user.department.building.name,
                                province: user.department.building.province
                                    ? {
                                        id: user.department.building.province.id,
                                        name: user.department.building.province.name,
                                    }
                                    : null,
                            }
                            : null,
                    }
                    : null,
            },
        };
    }
    async refresh(_refreshToken) {
        await Promise.resolve();
        throw new common_1.BadRequestException('Refresh token feature is disabled in this schema version');
    }
    async logoutAll(_userId) {
        await Promise.resolve();
        return { message: 'Logged out' };
    }
    async updateProfile(userId, data) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.fullName !== undefined && { name: data.fullName }),
                ...(data.phone !== undefined && { phone: data.phone }),
                ...(data.provinceId !== undefined && { provinceId: data.provinceId }),
                ...(data.departmentId !== undefined && {
                    departmentId: data.departmentId,
                }),
            },
        });
        return this.getCurrentUser(userId);
    }
    async getCurrentUser(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
                department: {
                    include: {
                        building: {
                            include: {
                                province: true,
                            },
                        },
                    },
                },
                province: true,
            },
        });
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        const primaryRole = user.roles.length > 0 ? user.roles[0].role : null;
        return {
            id: user.id,
            email: user.email,
            fullName: user.name,
            phone: user.phone,
            employeeNumber: user.employeeNumber,
            role: primaryRole
                ? {
                    id: primaryRole.id,
                    name: primaryRole.name,
                }
                : null,
            province: user.province
                ? {
                    id: user.province.id,
                    name: user.province.name,
                }
                : null,
            department: user.department
                ? {
                    id: user.department.id,
                    name: user.department.name,
                    building: user.department.building
                        ? {
                            id: user.department.building.id,
                            name: user.department.building.name,
                            province: user.department.building.province
                                ? {
                                    id: user.department.building.province.id,
                                    name: user.department.building.province.name,
                                }
                                : null,
                        }
                        : null,
                }
                : null,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map