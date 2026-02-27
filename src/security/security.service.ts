import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SecurityService {
  constructor(private readonly prisma: PrismaService) {}

  private get securityWhereClause() {
    return {
      OR: [
        { type: 'Safety' },
        { category: { equals: 'Security', mode: 'insensitive' as const } },
      ],
    };
  }

  async createIncident(body: any) {
    return this.prisma.incident.create({
      data: {
        incidentNumber: body.incidentNumber ?? `SEC-${Date.now()}`,
        type: 'Safety',
        category: 'Security',
        severity: body.severity ?? 'High',
        description: body.description ?? 'Security Incident',
        occurredAt: body.occurredAt ? new Date(body.occurredAt) : new Date(),
        reportedById: body.reportedBy ?? body.userId,
        buildingId: body.buildingId,
        status: 'RAISED',
      },
    });
  }

  async getStats() {
    const critical = await this.prisma.incident.count({
      where: {
        ...this.securityWhereClause,
        severity: 'Critical',
        status: { not: 'CLOSED' },
      },
    });
    const high = await this.prisma.incident.count({
      where: {
        ...this.securityWhereClause,
        severity: 'High',
        status: { not: 'CLOSED' },
      },
    });
    const investigating = await this.prisma.incident.count({
      where: {
        ...this.securityWhereClause,
        status: 'INVESTIGATION_IN_PROGRESS',
      },
    });

    // Resolution rate
    const total = await this.prisma.incident.count({
      where: this.securityWhereClause,
    });
    const resolved = await this.prisma.incident.count({
      where: {
        ...this.securityWhereClause,
        status: { in: ['COMPLETED', 'CLOSED'] },
      },
    });
    const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return [
      { id: 1, label: 'Critical', value: critical.toString() },
      { id: 2, label: 'High Priority', value: high.toString() },
      { id: 3, label: 'Under investigation', value: investigating.toString() },
      { id: 4, label: 'Resolution Rate', value: `${rate}%` },
    ];
  }

  async getIncidents() {
    return this.prisma.incident.findMany({
      where: this.securityWhereClause,
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async getIncidentTrends() {
    const now = new Date();
    const months: Date[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d);
    }

    const data = await Promise.all(
      months.map(async (date) => {
        const monthName = date.toLocaleString('default', { month: 'short' });
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        const count = await this.prisma.incident.count({
          where: {
            ...this.securityWhereClause,
            createdAt: {
              gte: date,
              lt: nextMonth,
            },
          },
        });
        return { name: monthName, count };
      }),
    );

    return data;
  }

  async getSeverityDistribution() {
    const types = ['Critical', 'High', 'Medium', 'Low'];
    const counts = await Promise.all(
      types.map((sev) =>
        this.prisma.incident.count({
          where: { ...this.securityWhereClause, severity: sev },
        }),
      ),
    );

    return {
      critical: counts[0],
      high: counts[1],
      medium: counts[2],
      low: counts[3],
    };
  }
}
