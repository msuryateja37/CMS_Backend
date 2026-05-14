import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: any) {
    if (!body?.invoiceNumber)
      throw new BadRequestException('invoiceNumber is required');
    if (body?.amount == null)
      throw new BadRequestException('amount is required');
    if (!body?.receivedDate)
      throw new BadRequestException('receivedDate is required');

    return this.prisma.invoice.create({
      data: {
        invoiceNumber: body.invoiceNumber,
        description: body.vendorName
          ? `Vendor: ${body.vendorName}`
          : body.description,
        amount: body.amount,
        receivedDate: new Date(body.receivedDate),
        status: 'PENDING', // Default to PENDING as RECEIVED is not in Enum
        incidentId: body.incidentId,
      },
    });
  }

  list(status?: string) {
    const where: any = {};
    if (status) where.status = status;

    return this.prisma.invoice.findMany({
      where,
      orderBy: { receivedDate: 'desc' },
    });
  }

  async getById(id: string) {
    const inv = await this.prisma.invoice.findUnique({ where: { id } });
    if (!inv) throw new NotFoundException('Invoice not found');
    return inv;
  }

  async transition(
    id: string,
    newStatus: string,
    performedById: string,
    note?: string,
  ) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Invoice not found');

    // Map status if needed, or assume valid Enum string
    const validStatus = ['PENDING', 'APPROVED', 'REJECTED'].includes(newStatus)
      ? newStatus
      : 'PENDING';
    if (newStatus === 'REJECTED' && !note)
      throw new BadRequestException('reason is required');

    const updated = await this.prisma.invoice.update({
      where: { id },
      data: { status: validStatus as any },
    });

    await this.prisma.invoiceAction.create({
      data: {
        invoiceId: id,
        action: note ? `${newStatus}:${note}` : newStatus,
        actorId: performedById,
      },
    });
    return updated;
  }

  actions(invoiceId: string) {
    return this.prisma.invoiceAction.findMany({
      where: { invoiceId },
      orderBy: { timestamp: 'desc' },
    });
  }
}
