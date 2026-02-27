import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OhsService {
  constructor(private readonly prisma: PrismaService) {}

  createRisk(userId: string, body: any) {
    if (!body?.title) throw new BadRequestException('title is required');
    return this.prisma.riskRegister.create({
      data: {
        title: body.title,
        description: body.description,
        riskLevel: body.riskLevel,
        departmentId: body.departmentId,
        createdById: userId,
      },
    });
  }

  listRisks() {
    return this.prisma.riskRegister.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  createJsa(userId: string, body: any) {
    if (!body?.jobName) throw new BadRequestException('jobName is required');
    return this.prisma.jsa.create({
      data: {
        jobName: body.jobName,
        hazards: body.hazards,
        controls: body.controls,
        remarks: body.remarks,
        createdById: userId,
      },
    });
  }

  scheduleInspection(body: any) {
    if (!body?.type) throw new BadRequestException('type is required');
    return this.prisma.inspection.create({
      data: {
        type: body.type,
        buildingId: body.buildingId,
        inspectorId: body.inspectorId,
        status: body.status ?? 'SCHEDULED',
        conductedAt: body.conductedAt ? new Date(body.conductedAt) : undefined,
      },
    });
  }

  async submitInspection(id: string, body: any) {
    return this.prisma.inspection.update({
      where: { id },
      data: {
        status: body.status ?? 'SUBMITTED',
        conductedAt: body.conductedAt ? new Date(body.conductedAt) : new Date(),
      },
    });
  }

  listInspections(buildingId?: string) {
    return this.prisma.inspection.findMany({
      where: buildingId ? { buildingId } : undefined,
      orderBy: { conductedAt: 'desc' },
      include: { findings: true },
    });
  }

  addFinding(body: any) {
    if (!body?.inspectionId || !body?.finding)
      throw new BadRequestException('inspectionId and finding are required');
    return this.prisma.inspectionFinding.create({
      data: {
        inspectionId: body.inspectionId,
        finding: body.finding,
        actionRequired: body.actionRequired,
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        status: body.status ?? 'OPEN',
      },
    });
  }

  closeFinding(id: string) {
    return this.prisma.inspectionFinding.update({
      where: { id },
      data: { status: 'CLOSED' },
    });
  }

  async listHazards() {
    return this.prisma.incident.findMany({
      where: { type: 'HAZARD' },
      include: { building: true, reportedBy: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listJsa() {
    return this.prisma.jsa.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async listSwp() {
    return [];
  }

  async getStats() {
    const [total, open, closed] = await Promise.all([
      this.prisma.incident.count({ where: { type: 'HAZARD' } }),
      this.prisma.incident.count({
        where: { type: 'HAZARD', status: 'RAISED' },
      }),
      this.prisma.incident.count({
        where: { type: 'HAZARD', status: { in: ['COMPLETED', 'CLOSED'] } },
      }),
    ]);

    return { total, open, closed };
  }
}
