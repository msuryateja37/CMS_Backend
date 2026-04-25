import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  async getForms() {
    return this.prisma.form.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFormById(id: string) {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            questions: {
              orderBy: { orderIndex: 'asc' },
              include: {
                options: {
                  orderBy: { orderIndex: 'asc' },
                },
              },
            },
          },
        },
      },
    });
    if (!form) {
      throw new NotFoundException('Form not found');
    }
    return form;
  }

  async createForm(data: any) {
    const { title, description, sections } = data;

    return this.prisma.form.create({
      data: {
        title,
        description,
        sections: {
          create: sections?.map((section: any, sIdx: number) => ({
            title: section.title,
            orderIndex: section.orderIndex ?? sIdx,
            questions: {
              create: section.questions?.map((q: any, qIdx: number) => ({
                label: q.label,
                inputType: q.inputType || 'radio',
                placeholder: q.placeholder,
                orderIndex: q.orderIndex ?? qIdx,
                options: {
                  create: q.options?.map((opt: any, oIdx: number) => ({
                    optionLabel: opt.optionLabel,
                    optionValue: opt.optionValue,
                    orderIndex: opt.orderIndex ?? oIdx,
                  })),
                },
              })),
            },
          })),
        },
      },
    });
  }

  async submitResponse(formId: string, data: any) {
    const { submittedBy, answers } = data;

    return this.prisma.formResponse.create({
      data: {
        formId,
        submittedBy,
        answers: {
          create: answers.map((ans: any) => ({
            questionId: ans.questionId,
            answerText: ans.answerText,
            selectedOptionId: ans.selectedOptionId,
          })),
        },
      },
    });
  }
}
