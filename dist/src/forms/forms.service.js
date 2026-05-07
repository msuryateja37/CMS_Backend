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
let FormsService = class FormsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getForms() {
        return this.prisma.form.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getFormById(id) {
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
            throw new common_1.NotFoundException('Form not found');
        }
        return form;
    }
    async createForm(data) {
        const { title, description, sections } = data;
        return this.prisma.form.create({
            data: {
                title,
                description,
                sections: {
                    create: sections?.map((section, sIdx) => ({
                        title: section.title,
                        orderIndex: section.orderIndex ?? sIdx,
                        questions: {
                            create: section.questions?.map((q, qIdx) => ({
                                label: q.label,
                                inputType: q.inputType || 'radio',
                                placeholder: q.placeholder,
                                orderIndex: q.orderIndex ?? qIdx,
                                options: {
                                    create: q.options?.map((opt, oIdx) => ({
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
    async submitResponse(formId, data) {
        const { submittedBy, answers } = data;
        return this.prisma.formResponse.create({
            data: {
                formId,
                submittedBy,
                answers: {
                    create: answers.map((ans) => ({
                        questionId: ans.questionId,
                        answerText: ans.answerText,
                        selectedOptionId: ans.selectedOptionId,
                    })),
                },
            },
        });
    }
};
exports.FormsService = FormsService;
exports.FormsService = FormsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FormsService);
//# sourceMappingURL=forms.service.js.map