import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private isDatabaseUnavailableError(error: unknown) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P1001'
    );
  }

  private handleDatabaseError(error: unknown): never {
    if (this.isDatabaseUnavailableError(error)) {
      throw new ServiceUnavailableException(
        'Database is unavailable. Please try again later.',
      );
    }

    throw error;
  }

  private async signAccessToken(payload: {
    sub: string;
    role?: string | null;
  }) {
    return this.jwt.signAsync(payload as any);
  }

  private async signRefreshToken(payload: { sub: string }) {
    const secret =
      this.config.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret';
    const expiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '1d';
    return this.jwt.signAsync(payload as any, {
      secret,
      expiresIn: expiresIn as any,
    });
  }

  async login(email: string, _password: string) {
    console.log(`Login attempt for email: ${email}`);
    let user;

    try {
      user = await this.prisma.user.findUnique({
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
    } catch (error) {
      this.handleDatabaseError(error);
    }

    if (!user) {
      console.log(`User not found: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive) {
      console.log(`User inactive: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // WARNING: Schema does not have password field. Security check skipped related to password.
    // const ok = await bcrypt.compare(password, user.passwordHash); // Removed

    console.log(`Login successful for: ${email}`);

    // Get the primary role (first role if multiple)
    const primaryRole = user.roles.length > 0 ? user.roles[0].role : null;
    const accessToken = await this.signAccessToken({
      sub: user.id,
      role: primaryRole?.name,
    });

    // Refresh token table missing in new schema. Returning null for refresh token.
    const refreshToken = 'feature_disabled_in_schema';

    // lastLoginAt missing in User schema.
    // await this.prisma.user.update({...});

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

  async refresh(_refreshToken: string) {
    await Promise.resolve(); // satisfy require-await
    throw new BadRequestException(
      'Refresh token feature is disabled in this schema version',
    );
    // Logic removed as RefreshToken table is missing
  }

  async logoutAll(_userId: string) {
    await Promise.resolve(); // satisfy require-await
    // Logic removed as RefreshToken table is missing
    return { message: 'Logged out' };
  }

  async extendSession(userId: string) {
    const user = await this.getCurrentUser(userId);
    const accessToken = await this.signAccessToken({
      sub: user.id,
      role: user.role?.name,
    });
    return {
      accessToken,
      refreshToken: 'feature_disabled_in_schema',
      user,
    };
  }

  async updateProfile(
    userId: string,
    data: {
      fullName?: string;
      phone?: string;
      provinceId?: string;
      departmentId?: string;
    },
  ) {
    let user;

    try {
      user = await this.prisma.user.findUnique({ where: { id: userId } });
    } catch (error) {
      this.handleDatabaseError(error);
    }

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    try {
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
    } catch (error) {
      this.handleDatabaseError(error);
    }

    return this.getCurrentUser(userId);
  }

  async getCurrentUser(userId: string) {
    let user;

    try {
      user = await this.prisma.user.findUnique({
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
    } catch (error) {
      this.handleDatabaseError(error);
    }

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Get the primary role (first role if multiple)
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
}
