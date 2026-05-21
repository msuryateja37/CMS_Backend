import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InputType, FormVersionStatus, Prisma } from '@prisma/client';
import type {
  CreateFormDto,
  CreateFormVersionDto,
  CreateSectionDto,
  SubmitResponseDto,
} from './dto/create-form.dto';

// ─── Schema serialiser ────────────────────────────────────────────────────────
// Builds the frozen JSONB snapshot from the live canvas rows.

function buildSchema(
  sections: Array<{
    id: string;
    title: string;
    description: string | null;
    orderIndex: number;
    questions: Array<{
      id: string;
      label: string;
      inputType: InputType;
      placeholder: string | null;
      isRequired: boolean;
      orderIndex: number;
      validationRules: Prisma.JsonValue;
      options: Array<{
        id: string;
        optionLabel: string;
        optionValue: string;
        orderIndex: number;
      }>;
    }>;
  }>,
) {
  return {
    sections: sections.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      orderIndex: s.orderIndex,
      questions: s.questions.map((q) => ({
        id: q.id,
        label: q.label,
        inputType: q.inputType,
        placeholder: q.placeholder,
        isRequired: q.isRequired,
        orderIndex: q.orderIndex,
        validationRules: q.validationRules,
        options: q.options.map((o) => ({
          id: o.id,
          optionLabel: o.optionLabel,
          optionValue: o.optionValue,
          orderIndex: o.orderIndex,
        })),
      })),
    })),
  };
}

// ─── Canvas include helper ────────────────────────────────────────────────────
const canvasInclude = {
  sections: {
    orderBy: { orderIndex: 'asc' as const },
    include: {
      questions: {
        orderBy: { orderIndex: 'asc' as const },
        include: {
          options: { orderBy: { orderIndex: 'asc' as const } },
        },
      },
    },
  },
};

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class FormsService {
  constructor(private prisma: PrismaService) {}

  // ── List all forms (latest active version metadata) ────────────────────────

  async getForms() {
    const forms = await this.prisma.form.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        versions: {
          where: { isActive: true },
          select: {
            id: true,
            versionNumber: true,
            title: true,
            description: true,
            status: true,
            publishedAt: true,
            createdAt: true,
          },
        },
      },
    });
    return forms.map((f) => ({
      id: f.id,
      slug: f.slug,
      createdAt: f.createdAt,
      activeVersion: f.versions[0] ?? null,
    }));
  }

  // ── Get a single form with its active version schema ──────────────────────

  async getFormById(formId: string) {
    const form = await this.prisma.form.findUnique({
      where: { id: formId },
      include: {
        versions: {
          where: { isActive: true },
          include: canvasInclude,
        },
      },
    });
    if (!form) throw new NotFoundException(`Form ${formId} not found`);
    return form;
  }

  // ── Get the rendered active form (schema JSON — hot path) ─────────────────

  async getActiveSchema(formId: string) {
    const version = await this.prisma.formVersion.findFirst({
      where: { formId, isActive: true, status: FormVersionStatus.PUBLISHED },
    });
    if (!version) throw new NotFoundException('No published active version for this form');
    
    // Return formId along with the frozen schema
    return {
      formId: version.formId,
      ...(version.schema as any),
    };
  }

  // ── Get the rendered schema by slug (hot path for slug-based embed) ───────

  async getActiveSchemaBySlug(slug: string) {
    const form = await this.prisma.form.findUnique({ where: { slug } });
    if (!form) throw new NotFoundException(`Form with slug "${slug}" not found`);
    return this.getActiveSchema(form.id);
  }

  // ── Create a new form + draft version ─────────────────────────────────────

  async createForm(dto: CreateFormDto) {
    const { slug, createdBy, title, description, sections } = dto;

    return this.prisma.form.create({
      data: {
        slug,
        createdBy,
        versions: {
          create: {
            versionNumber: 1,
            title,
            description,
            status: FormVersionStatus.DRAFT,
            isActive: false,
            sections: {
              create: (sections ?? []).map((s: CreateSectionDto, sIdx: number) => ({
                title: s.title,
                description: s.description,
                orderIndex: s.orderIndex ?? sIdx,
                questions: {
                  create: (s.questions ?? []).map((q, qIdx) => ({
                    label: q.label,
                    inputType: (q.inputType as InputType) ?? InputType.TEXT,
                    placeholder: q.placeholder,
                    isRequired: q.isRequired ?? false,
                    orderIndex: q.orderIndex ?? qIdx,
                    validationRules: q.validationRules ?? Prisma.JsonNull,
                    options: {
                      create: (q.options ?? []).map((o, oIdx) => ({
                        optionLabel: o.optionLabel,
                        optionValue: o.optionValue,
                        orderIndex: o.orderIndex ?? oIdx,
                      })),
                    },
                  })),
                },
              })),
            },
          },
        },
      },
      include: {
        versions: { include: canvasInclude },
      },
    });
  }

  // ── Add a new draft version to an existing form ────────────────────────────

  async createVersion(formId: string, dto: CreateFormVersionDto) {
    const form = await this.prisma.form.findUnique({ where: { id: formId } });
    if (!form) throw new NotFoundException(`Form ${formId} not found`);

    const last = await this.prisma.formVersion.findFirst({
      where: { formId },
      orderBy: { versionNumber: 'desc' },
      select: { versionNumber: true },
    });
    const nextVersion = (last?.versionNumber ?? 0) + 1;

    return this.prisma.formVersion.create({
      data: {
        formId,
        versionNumber: nextVersion,
        title: dto.title,
        description: dto.description,
        status: FormVersionStatus.DRAFT,
        isActive: false,
        sections: {
          create: (dto.sections ?? []).map((s, sIdx) => ({
            title: s.title,
            description: s.description,
            orderIndex: s.orderIndex ?? sIdx,
            questions: {
              create: (s.questions ?? []).map((q, qIdx) => ({
                label: q.label,
                inputType: (q.inputType as InputType) ?? InputType.TEXT,
                placeholder: q.placeholder,
                isRequired: q.isRequired ?? false,
                orderIndex: q.orderIndex ?? qIdx,
                validationRules: q.validationRules ?? Prisma.JsonNull,
                options: {
                  create: (q.options ?? []).map((o, oIdx) => ({
                    optionLabel: o.optionLabel,
                    optionValue: o.optionValue,
                    orderIndex: o.orderIndex ?? oIdx,
                  })),
                },
              })),
            },
          })),
        },
      },
      include: canvasInclude,
    });
  }

  // ── Publish a draft version (freeze schema, set as active) ────────────────

  async publishVersion(versionId: string) {
    const version = await this.prisma.formVersion.findUnique({
      where: { id: versionId },
      include: canvasInclude,
    });
    if (!version) throw new NotFoundException(`Version ${versionId} not found`);
    if (version.status !== FormVersionStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT versions can be published');
    }

    const schema = buildSchema(version.sections as any);

    // Atomically: deactivate all versions of this form, then publish this one
    await this.prisma.$transaction([
      this.prisma.formVersion.updateMany({
        where: { formId: version.formId },
        data: { isActive: false },
      }),
      this.prisma.formVersion.update({
        where: { id: versionId },
        data: {
          status: FormVersionStatus.PUBLISHED,
          isActive: true,
          publishedAt: new Date(),
          schema: schema as any,
        },
      }),
    ]);

    return this.prisma.formVersion.findUnique({ where: { id: versionId } });
  }

  // ── Archive a published version ────────────────────────────────────────────

  async archiveVersion(versionId: string) {
    const version = await this.prisma.formVersion.findUnique({ where: { id: versionId } });
    if (!version) throw new NotFoundException(`Version ${versionId} not found`);
    return this.prisma.formVersion.update({
      where: { id: versionId },
      data: { status: FormVersionStatus.ARCHIVED, isActive: false },
    });
  }

  // ── Update canvas of a draft version (save without publishing) ─────────────

  async updateCanvas(versionId: string, dto: CreateFormVersionDto) {
    const version = await this.prisma.formVersion.findUnique({
      where: { id: versionId },
      include: { sections: { include: { questions: { include: { options: true } } } } },
    });
    if (!version) throw new NotFoundException(`Version ${versionId} not found`);
    if (version.status !== FormVersionStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT versions can be edited');
    }

    // Delete all existing canvas rows and recreate from DTO
    const sectionIds = version.sections.map(s => s.id);
    const questionIds = version.sections.flatMap(s => s.questions.map(q => q.id));

    await this.prisma.$transaction([
      this.prisma.questionOption.deleteMany({ where: { questionId: { in: questionIds } } }),
      this.prisma.questionInput.deleteMany({ where: { sectionId: { in: sectionIds } } }),
      this.prisma.formSection.deleteMany({ where: { formVersionId: versionId } }),
      this.prisma.formVersion.update({
        where: { id: versionId },
        data: {
          title: dto.title ?? version.title,
          description: dto.description ?? version.description,
        },
      }),
    ]);

    // Re-create sections
    for (let sIdx = 0; sIdx < (dto.sections ?? []).length; sIdx++) {
      const s = dto.sections![sIdx];
      const newSection = await this.prisma.formSection.create({
        data: {
          formVersionId: versionId,
          title: s.title,
          description: s.description,
          orderIndex: s.orderIndex ?? sIdx,
        },
      });
      for (let qIdx = 0; qIdx < (s.questions ?? []).length; qIdx++) {
        const q = s.questions![qIdx];
        const newQ = await this.prisma.questionInput.create({
          data: {
            sectionId: newSection.id,
            label: q.label,
            inputType: (q.inputType as InputType) ?? InputType.TEXT,
            placeholder: q.placeholder,
            isRequired: q.isRequired ?? false,
            orderIndex: q.orderIndex ?? qIdx,
            validationRules: q.validationRules ?? Prisma.JsonNull,
          },
        });
        if (q.options?.length) {
          await this.prisma.questionOption.createMany({
            data: q.options.map((o, oIdx) => ({
              questionId: newQ.id,
              optionLabel: o.optionLabel,
              optionValue: o.optionValue,
              orderIndex: o.orderIndex ?? oIdx,
            })),
          });
        }
      }
    }

    return this.prisma.formVersion.findUnique({
      where: { id: versionId },
      include: canvasInclude,
    });
  }

  // ── List all versions for a form ──────────────────────────────────────────

  async getVersions(formId: string) {
    return this.prisma.formVersion.findMany({
      where: { formId },
      orderBy: { versionNumber: 'desc' },
      select: {
        id: true,
        versionNumber: true,
        title: true,
        description: true,
        status: true,
        isActive: true,
        publishedAt: true,
        createdAt: true,
      },
    });
  }

  // ── Submit a response (pins to active published version) ──────────────────

  async submitResponse(formId: string, dto: SubmitResponseDto) {
    const version = await this.prisma.formVersion.findFirst({
      where: { formId, isActive: true, status: FormVersionStatus.PUBLISHED },
      select: { id: true },
    });
    if (!version) {
      throw new BadRequestException('No published active version — cannot accept responses');
    }

    return this.prisma.formResponse.create({
      data: {
        formId,
        formVersionId: version.id,
        submittedBy: dto.submittedBy,
        answers: {
          create: dto.answers.map((a) => ({
            questionId: a.questionId,
            answerText: a.answerText,
            selectedOptionId: a.selectedOptionId,
            comment: a.comment,
          })),
        },
      },
      include: { answers: true },
    });
  }

  // ── Get responses for a form (renders via schema, no joins) ───────────────

  async getResponses(formId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [total, responses] = await this.prisma.$transaction([
      this.prisma.formResponse.count({ where: { formId } }),
      this.prisma.formResponse.findMany({
        where: { formId },
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limit,
        include: {
          formVersion: { select: { versionNumber: true, schema: true } },
          answers: true,
        },
      }),
    ]);
    return { total, page, limit, data: responses };
  }

  // ── Get a single response with schema context ─────────────────────────────

  async getResponse(responseId: string) {
    const response = await this.prisma.formResponse.findUnique({
      where: { id: responseId },
      include: {
        formVersion: { select: { versionNumber: true, schema: true } },
        answers: true,
      },
    });
    if (!response) throw new NotFoundException(`Response ${responseId} not found`);
    return response;
  }

  // ── Analytics: answer distribution per question ───────────────────────────

  async getQuestionAnalytics(questionId: string) {
    const [textAnswers, optionCounts] = await this.prisma.$transaction([
      this.prisma.questionResponse.count({
        where: { questionId, answerText: { not: null } },
      }),
      this.prisma.questionResponse.groupBy({
        by: ['selectedOptionId'],
        where: { questionId, selectedOptionId: { not: null } },
        _count: { selectedOptionId: true },
        orderBy: { selectedOptionId: 'asc' },
      }),
    ]);
    return { questionId, textAnswers, optionCounts };
  }

  // ── Legacy: seeded-form helpers (by title keyword) ────────────────────────

  async getFormByTitleKeyword(keyword: string) {
    const version = await this.prisma.formVersion.findFirst({
      where: {
        title: { contains: keyword, mode: 'insensitive' },
        status: FormVersionStatus.PUBLISHED,
        isActive: true,
      },
      include: canvasInclude,
    });
    if (!version) throw new NotFoundException(`No published form matching "${keyword}"`);
    return version;
  }
  async getUserResponses(userId: string) {
    return this.prisma.formResponse.findMany({
      where: { submittedBy: userId },
      orderBy: { submittedAt: 'desc' },
      include: {
        form: {
          select: { id: true, slug: true }
        },
        formVersion: {
          select: { id: true, title: true, schema: true }
        },
        answers: {
          include: {
            question: { select: { id: true, label: true } },
            selectedOption: { select: { id: true, optionLabel: true } }
          }
        }
      }
    });
  }
}
