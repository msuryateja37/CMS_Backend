import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async createProvince(name: string) {
    if (!name) throw new BadRequestException('name is required');
    return this.prisma.province.create({ data: { name } });
  }

  async listProvinces() {
    return this.prisma.province.findMany({ orderBy: { name: 'asc' } });
  }

  async createBuilding(input: {
    name: string;
    provinceId: string;
    postalCode?: string;
    address?: string;
  }) {
    return this.prisma.building.create({
      data: {
        name: input.name,
        provinceId: input.provinceId,
        postalCode: input.postalCode,
        address: input.address,
      },
    });
  }

  async listBuildings(provinceId?: string) {
    return this.prisma.building.findMany({
      where: provinceId ? { provinceId } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async createDepartment(input: { name: string; buildingId: string }) {
    return this.prisma.department.create({
      data: { name: input.name, buildingId: input.buildingId },
    });
  }

  async listDepartments(buildingId?: string) {
    return this.prisma.department.findMany({
      where: buildingId ? { buildingId } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async updateOrg(type: string, id: string, body: any) {
    if (type === 'provinces') {
      return this.prisma.province.update({
        where: { id },
        data: { name: body.name },
      });
    }
    if (type === 'buildings') {
      return this.prisma.building.update({
        where: { id },
        data: {
          name: body.name,
          provinceId: body.provinceId,
          postalCode: body.postalCode,
          address: body.address,
        },
      });
    }
    if (type === 'departments') {
      return this.prisma.department.update({
        where: { id },
        data: { name: body.name, buildingId: body.buildingId },
      });
    }
    throw new NotFoundException('Unknown org type');
  }
}
