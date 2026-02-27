import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  async push(userId: string, body: any) {
    const items: any[] = Array.isArray(body?.items) ? body.items : [];
    const created = await Promise.all(
      items.map((i) =>
        this.prisma.syncQueue.create({
          data: {
            userId, // Schema added this via Step 548
            entity: i.entity, // Schema added this
            entityId: i.entityId, // Schema added this
            action: i.operation ?? 'Unknown', // Map operation -> action
            payload: i.payload ?? {},
            status: 'PENDING',
          },
        }),
      ),
    );
    return { status: 'ok', queued: created.length };
  }

  pull(since?: string) {
    const sinceDate = since ? new Date(since) : undefined;
    return this.prisma.syncQueue.findMany({
      where: sinceDate ? { createdAt: { gt: sinceDate } } : undefined,
      orderBy: { createdAt: 'asc' },
      take: 200,
    });
  }

  async resolve(body: any) {
    if (!body?.id || !body?.status)
      throw new BadRequestException('id and status are required');
    return this.prisma.syncQueue.update({
      where: { id: body.id },
      data: { status: body.status },
    });
  }
}
