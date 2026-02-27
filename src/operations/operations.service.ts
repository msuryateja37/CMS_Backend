import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listEquipment() {
    return this.prisma.equipment.findMany({
      include: { building: true },
      orderBy: { name: 'asc' },
    });
  }

  async listInspections() {
    return this.prisma.inspection.findMany({
      include: { building: true, inspector: true },
      orderBy: { conductedAt: 'desc' },
    });
  }

  async listDrills() {
    return this.prisma.drill.findMany({
      include: { building: true },
      orderBy: { scheduledDate: 'desc' },
    });
  }

  async listAudits() {
    return this.prisma.incident.findMany({
      where: { type: 'AUDIT' },
      include: { building: true, reportedBy: true },
      orderBy: { occurredAt: 'desc' },
    });
  }

  async listPermits() {
    return this.prisma.incident.findMany({
      where: { type: 'PERMIT' },
      include: { building: true, reportedBy: true },
      orderBy: { occurredAt: 'desc' },
    });
  }
}
