import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KpiService {
  constructor(private readonly prisma: PrismaService) {}

  create(body: any) {
    if (!body?.name) throw new BadRequestException('name is required');
    return this.prisma.kpi.create({
      data: {
        name: body.name,
        targetValue: body.targetValue,
        frequency: body.frequency,
        unit: body.unit ?? 'Count',
        // status: body.status ?? 'ACTIVE', // Status removed from Kpi model in schema if not present?
      },
    });
  }

  list() {
    return this.prisma.kpi.findMany({
      include: { records: true },
      orderBy: { name: 'asc' },
    });
  }

  record(body: any) {
    if (!body?.kpiId) throw new BadRequestException('kpiId is required');
    return this.prisma.kpiRecord.create({
      data: {
        kpiId: body.kpiId,
        value: body.value ?? body.actualValue,
        period: body.period ?? 'Monthly',
        recordedAt: body.recordedAt ? new Date(body.recordedAt) : new Date(),
      },
    });
  }

  async getDashboardMetrics() {
    const totalCases = await this.prisma.incident.count();
    const activeCases = await this.prisma.incident.count({
      where: { status: { not: 'CLOSED' } },
    });
    const escalatedCases = await this.prisma.incident.count({
      where: { severity: 'Critical' }, // Proxy for escalated
    });
    const closedCases = await this.prisma.incident.count({
      where: { status: 'CLOSED' },
    });

    // Avg response time - placeholder
    const avgResponseTime = 0;

    return {
      totalCases,
      activeCases,
      escalatedCases,
      closedCases,
      avgResponseTime,
      activeAssignmentsCount: activeCases,
      escalatedCasesCount: escalatedCases,
      closureRate:
        totalCases > 0
          ? Number(((closedCases / totalCases) * 100).toFixed(2))
          : 0,
    };
  }

  async getMetricsByProvince(provinceId: string) {
    const where = { building: { provinceId } };
    const totalCases = await this.prisma.incident.count({ where });
    const activeCases = await this.prisma.incident.count({
      where: { ...where, status: { not: 'CLOSED' } },
    });
    const escalatedCases = await this.prisma.incident.count({
      where: { ...where, severity: 'Critical' },
    });

    return {
      provinceId,
      totalCases,
      activeCases,
      escalatedCases,
      closureRate:
        totalCases > 0
          ? Number((((totalCases - activeCases) / totalCases) * 100).toFixed(2))
          : 0,
    };
  }

  async getMetricsByBuilding(buildingId: string) {
    const where = { buildingId };
    const totalCases = await this.prisma.incident.count({ where });
    const activeCases = await this.prisma.incident.count({
      where: { ...where, status: { not: 'CLOSED' } },
    });
    const escalatedCases = await this.prisma.incident.count({
      where: { ...where, severity: 'Critical' },
    });

    return {
      buildingId,
      totalCases,
      activeCases,
      escalatedCases,
      closureRate:
        totalCases > 0
          ? Number((((totalCases - activeCases) / totalCases) * 100).toFixed(2))
          : 0,
    };
  }

  async getMetricsByCategory(category: string) {
    const where = { category };
    const totalCases = await this.prisma.incident.count({ where });
    const activeCases = await this.prisma.incident.count({
      where: { ...where, status: { not: 'CLOSED' } },
    });
    const escalatedCases = await this.prisma.incident.count({
      where: { ...where, severity: 'Critical' },
    });

    return {
      categoryId: category,
      totalCases,
      activeCases,
      escalatedCases,
      closureRate:
        totalCases > 0
          ? Number((((totalCases - activeCases) / totalCases) * 100).toFixed(2))
          : 0,
    };
  }

  async getMetricsByPriority() {
    const severities = ['Critical', 'High', 'Medium', 'Low'];
    const metrics: any = {};

    for (const severity of severities) {
      const totalCases = await this.prisma.incident.count({
        where: { severity },
      });
      const activeCases = await this.prisma.incident.count({
        where: {
          severity,
          status: { not: 'CLOSED' },
        },
      });
      const escalatedCases = await this.prisma.incident.count({
        where: {
          severity,
          // isEscalated: true, // removed
        },
      });

      metrics[severity] = {
        totalCases,
        activeCases,
        escalatedCases,
        closureRate:
          totalCases > 0
            ? Number(
                (((totalCases - activeCases) / totalCases) * 100).toFixed(2),
              )
            : 0,
      };
    }

    return metrics;
  }
}
