import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new BadRequestException('Email already exists');

    // Note: Password hashing removed as 'passwordHash' field does not exist in current User schema.
    // If authentication is needed, schema update is required.
    // Also 'employeeCode' and 'phone' are missing in schema, so they are omitted.

    return this.prisma.user.create({
      data: {
        name: dto.fullName, // Map fullName to name
        email: dto.email,
        departmentId: dto.departmentId,
        provinceId: dto.provinceId, // Added provinceId support if in DTO, otherwise ignored by Prisma if undefined
        isActive: dto.isActive ?? true,
        roles: dto.roleId
          ? {
              create: {
                roleId: dto.roleId,
              },
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        departmentId: true,
        provinceId: true,
        isActive: true,
        createdAt: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async list(opts: { page: number; pageSize: number }) {
    const page = Number.isFinite(opts.page) && opts.page > 0 ? opts.page : 1;
    const pageSize =
      Number.isFinite(opts.pageSize) && opts.pageSize > 0
        ? Math.min(opts.pageSize, 100)
        : 20;
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          departmentId: true,
          provinceId: true,
          isActive: true,
          createdAt: true,
          // lastLoginAt does not exist in schema
          // updatedAt does not exist in schema
          roles: {
            include: {
              role: true,
            },
          },
        },
      }),
      this.prisma.user.count(),
    ]);
    return { page, pageSize, total, items };
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: {
        name: dto.fullName,
        departmentId: dto.departmentId,
        provinceId: dto.provinceId,
        isActive: dto.isActive,
        // Handle role update if roleId is provided - simplistic replacement approach
        // This might need more complex logic for multiple roles, but sticking to single role ID from DTO for now
        roles: dto.roleId
          ? {
              deleteMany: {}, // Remove existing roles
              create: { roleId: dto.roleId }, // Add new role
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        departmentId: true,
        provinceId: true,
        isActive: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async listByProvince(provinceId: string) {
    return this.prisma.user.findMany({
      where: { provinceId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        employeeNumber: true,
        departmentId: true,
        provinceId: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async listFiltered(query: {
    provinceId?: string;
    departmentId?: string;
    role?: string;
  }) {
    const where: any = {};
    if (query.provinceId) where.provinceId = query.provinceId;
    if (query.departmentId) where.departmentId = query.departmentId;
    if (query.role) {
      where.roles = {
        some: {
          role: {
            name: query.role,
          },
        },
      };
    }

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        employeeNumber: true,
        departmentId: true,
        provinceId: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        province: {
          select: {
            id: true,
            name: true,
          },
        },
        // Count active assigned tickets (non-CLOSED, non-COMPLETED)
        assignedIncidents: {
          where: {
            incident: {
              status: {
                notIn: ['CLOSED', 'COMPLETED'],
              },
            },
          },
          select: { id: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Map to include ticketCount instead of raw assignments array
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      employeeNumber: user.employeeNumber,
      departmentId: user.departmentId,
      provinceId: user.provinceId,
      department: user.department,
      province: user.province,
      ticketCount: user.assignedIncidents.length,
    }));
  }
}
