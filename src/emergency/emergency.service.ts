import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmergencyService {
  constructor(private readonly prisma: PrismaService) {}

  createPlan(body: any) {
    if (!body?.title) throw new BadRequestException('title is required');
    return this.prisma.emergencyPlan.create({
      data: {
        title: body.title,
        version: body.version ?? '1.0',
        documentPath: body.documentPath,
        fileUrl: body.fileUrl,
        // buildingId removed as not in schema
      },
    });
  }

  listPlans() {
    return this.prisma.emergencyPlan.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  registerEquipment(body: any) {
    if (!body?.name) throw new BadRequestException('name is required');
    return this.prisma.equipment.create({
      data: {
        name: body.name,
        type: body.type ?? 'General',
        buildingId: body.buildingId,
        status: body.status ?? 'OPERATIONAL', // Schema default is OPERATIONAL
        lastChecked: body.lastChecked ? new Date(body.lastChecked) : undefined,
      },
    });
  }

  listEquipment() {
    return this.prisma.equipment.findMany({ orderBy: { name: 'asc' } });
  }

  recordDrill(body: any) {
    if (!body?.name) throw new BadRequestException('name is required');
    if (!body?.type) throw new BadRequestException('type is required');

    return this.prisma.drill.create({
      data: {
        name: body.name,
        type: body.type,
        status: body.status ?? 'SCHEDULED', // Valid Enum or String? Schema string.
        buildingId: body.buildingId,
        // notes, participants, organizer removed if not in schema. Schema Drill: id, name, type, scheduledDate, status, buildingId, createdAt, updatedAt.
        // notes? Missing in Schema.
        scheduledDate: body.scheduledDate
          ? new Date(body.scheduledDate)
          : new Date(),
      },
    });
  }

  listDrills() {
    return this.prisma.drill.findMany({ orderBy: { scheduledDate: 'asc' } });
  }
}
