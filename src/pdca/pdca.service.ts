import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PdcaService {
  constructor(private readonly prisma: PrismaService) {}

  create(body: any) {
    if (!body?.phase) throw new BadRequestException('phase is required');
    return this.prisma.pdcaAction.create({
      data: {
        title: body.title || 'Untitled Action',
        phase: body.phase,
        description: body.description,
        ownerId: body.ownerId,
        status: body.status ?? 'Pending',
      },
    });
  }

  update(id: string, body: any) {
    return this.prisma.pdcaAction.update({
      where: { id },
      data: {
        phase: body.phase,
        description: body.description,
        ownerId: body.ownerId,
        status: body.status,
      },
    });
  }

  list() {
    return this.prisma.pdcaAction.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
