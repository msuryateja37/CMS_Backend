import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDressingEntryDto } from './dto/create-dressing-entry.dto';

@Injectable()
export class DressingRegistryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateDressingEntryDto) {
    // If an incident ID is provided, verify it exists
    if (dto.incidentId) {
      const incident = await this.prisma.incident.findUnique({
        where: { id: dto.incidentId },
      });
      if (!incident) {
        throw new NotFoundException('Case not found');
      }
    }

    return this.prisma.dressingRegistry.create({
      data: {
        officeName: dto.officeName,
        date: new Date(dto.date),
        time: dto.time,
        name: dto.name,
        natureOfInjury: dto.natureOfInjury,
        treatmentRendered: dto.treatmentRendered,
        treatedById: userId,
        dateResumedWork: dto.dateResumedWork ? new Date(dto.dateResumedWork) : null,
        incidentId: dto.incidentId || null,
      },
      include: {
        treatedBy: {
          select: { id: true, name: true, email: true },
        },
        incident: {
          select: { id: true, incidentNumber: true },
        },
      },
    });
  }

  async getForUser(userId: string) {
    return this.prisma.dressingRegistry.findMany({
      where: { treatedById: userId },
      include: {
        treatedBy: {
          select: { id: true, name: true, email: true },
        },
        incident: {
          select: { id: true, incidentNumber: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }
}
