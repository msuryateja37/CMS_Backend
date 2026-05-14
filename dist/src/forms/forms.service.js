"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
function buildSchema(sections) {
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
const canvasInclude = {
    sections: {
        orderBy: { orderIndex: 'asc' },
        include: {
            questions: {
                orderBy: { orderIndex: 'asc' },
                include: {
                    options: { orderBy: { orderIndex: 'asc' } },
                },
            },
        },
    },
};
let FormsService = class FormsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async getFormById(formId) {
        const form = await this.prisma.form.findUnique({
            where: { id: formId },
            include: {
                versions: {
                    where: { isActive: true },
                    include: canvasInclude,
                },
            },
        });
        if (!form)
            throw new common_1.NotFoundException(`Form ${formId} not found`);
        return form;
    }
    async getActiveSchema(formId) {
        const version = await this.prisma.formVersion.findFirst({
            where: { formId, isActive: true, status: client_1.FormVersionStatus.PUBLISHED },
        });
        if (!version)
            throw new common_1.NotFoundException('No published active version for this form');
        return version.schema;
    }
    async getActiveSchemaBySlug(slug) {
        const form = await this.prisma.form.findUnique({ where: { slug } });
        if (!form)
            throw new common_1.NotFoundException(`Form with slug "${slug}" not found`);
        return this.getActiveSchema(form.id);
    }
    async createForm(dto) {
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
                        status: client_1.FormVersionStatus.DRAFT,
                        isActive: false,
                        sections: {
                            create: (sections ?? []).map((s, sIdx) => ({
                                title: s.title,
                                description: s.description,
                                orderIndex: s.orderIndex ?? sIdx,
                                questions: {
                                    create: (s.questions ?? []).map((q, qIdx) => ({
                                        label: q.label,
                                        inputType: q.inputType ?? client_1.InputType.TEXT,
                                        placeholder: q.placeholder,
                                        isRequired: q.isRequired ?? false,
                                        orderIndex: q.orderIndex ?? qIdx,
                                        validationRules: q.validationRules ?? client_1.Prisma.JsonNull,
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
    async createVersion(formId, dto) {
        const form = await this.prisma.form.findUnique({ where: { id: formId } });
        if (!form)
            throw new common_1.NotFoundException(`Form ${formId} not found`);
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
                status: client_1.FormVersionStatus.DRAFT,
                isActive: false,
                sections: {
                    create: (dto.sections ?? []).map((s, sIdx) => ({
                        title: s.title,
                        description: s.description,
                        orderIndex: s.orderIndex ?? sIdx,
                        questions: {
                            create: (s.questions ?? []).map((q, qIdx) => ({
                                label: q.label,
                                inputType: q.inputType ?? client_1.InputType.TEXT,
                                placeholder: q.placeholder,
                                isRequired: q.isRequired ?? false,
                                orderIndex: q.orderIndex ?? qIdx,
                                validationRules: q.validationRules ?? client_1.Prisma.JsonNull,
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
    async publishVersion(versionId) {
        const version = await this.prisma.formVersion.findUnique({
            where: { id: versionId },
            include: canvasInclude,
        });
        if (!version)
            throw new common_1.NotFoundException(`Version ${versionId} not found`);
        if (version.status !== client_1.FormVersionStatus.DRAFT) {
            throw new common_1.BadRequestException('Only DRAFT versions can be published');
        }
        const schema = buildSchema(version.sections);
        await this.prisma.$transaction([
            this.prisma.formVersion.updateMany({
                where: { formId: version.formId },
                data: { isActive: false },
            }),
            this.prisma.formVersion.update({
                where: { id: versionId },
                data: {
                    status: client_1.FormVersionStatus.PUBLISHED,
                    isActive: true,
                    publishedAt: new Date(),
                    schema: schema,
                },
            }),
        ]);
        return this.prisma.formVersion.findUnique({ where: { id: versionId } });
    }
    async archiveVersion(versionId) {
        const version = await this.prisma.formVersion.findUnique({ where: { id: versionId } });
        if (!version)
            throw new common_1.NotFoundException(`Version ${versionId} not found`);
        return this.prisma.formVersion.update({
            where: { id: versionId },
            data: { status: client_1.FormVersionStatus.ARCHIVED, isActive: false },
        });
    }
    async updateCanvas(versionId, dto) {
        const version = await this.prisma.formVersion.findUnique({
            where: { id: versionId },
            include: { sections: { include: { questions: { include: { options: true } } } } },
        });
        if (!version)
            throw new common_1.NotFoundException(`Version ${versionId} not found`);
        if (version.status !== client_1.FormVersionStatus.DRAFT) {
            throw new common_1.BadRequestException('Only DRAFT versions can be edited');
        }
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
        for (let sIdx = 0; sIdx < (dto.sections ?? []).length; sIdx++) {
            const s = dto.sections[sIdx];
            const newSection = await this.prisma.formSection.create({
                data: {
                    formVersionId: versionId,
                    title: s.title,
                    description: s.description,
                    orderIndex: s.orderIndex ?? sIdx,
                },
            });
            for (let qIdx = 0; qIdx < (s.questions ?? []).length; qIdx++) {
                const q = s.questions[qIdx];
                const newQ = await this.prisma.questionInput.create({
                    data: {
                        sectionId: newSection.id,
                        label: q.label,
                        inputType: q.inputType ?? client_1.InputType.TEXT,
                        placeholder: q.placeholder,
                        isRequired: q.isRequired ?? false,
                        orderIndex: q.orderIndex ?? qIdx,
                        validationRules: q.validationRules ?? client_1.Prisma.JsonNull,
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
    async getVersions(formId) {
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
    async submitResponse(formId, dto) {
        const version = await this.prisma.formVersion.findFirst({
            where: { formId, isActive: true, status: client_1.FormVersionStatus.PUBLISHED },
            select: { id: true },
        });
        if (!version) {
            throw new common_1.BadRequestException('No published active version — cannot accept responses');
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
                    })),
                },
            },
            include: { answers: true },
        });
    }
    async getResponses(formId, page = 1, limit = 20) {
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
    async getResponse(responseId) {
        const response = await this.prisma.formResponse.findUnique({
            where: { id: responseId },
            include: {
                formVersion: { select: { versionNumber: true, schema: true } },
                answers: true,
            },
        });
        if (!response)
            throw new common_1.NotFoundException(`Response ${responseId} not found`);
        return response;
    }
    async getQuestionAnalytics(questionId) {
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
    async getFormByTitleKeyword(keyword) {
        const version = await this.prisma.formVersion.findFirst({
            where: {
                title: { contains: keyword, mode: 'insensitive' },
                status: client_1.FormVersionStatus.PUBLISHED,
                isActive: true,
            },
            include: canvasInclude,
        });
        if (!version)
            throw new common_1.NotFoundException(`No published form matching "${keyword}"`);
        return version;
    }
};
exports.FormsService = FormsService;
exports.FormsService = FormsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FormsService);
//# sourceMappingURL=forms.service.js.map