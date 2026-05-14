import { FormsService } from './forms.service';
import type { CreateFormDto, CreateFormVersionDto, SubmitResponseDto } from './dto/create-form.dto';
export declare class FormsController {
    private readonly formsService;
    constructor(formsService: FormsService);
    getForms(): Promise<{
        id: string;
        slug: string | null;
        createdAt: Date;
        activeVersion: {
            id: string;
            createdAt: Date;
            description: string | null;
            versionNumber: number;
            title: string;
            status: import("@prisma/client").$Enums.FormVersionStatus;
            publishedAt: Date | null;
        };
    }[]>;
    createForm(dto: CreateFormDto): Promise<{
        versions: ({
            sections: ({
                questions: ({
                    options: {
                        id: string;
                        orderIndex: number;
                        optionLabel: string;
                        optionValue: string;
                        questionId: string;
                    }[];
                } & {
                    id: string;
                    orderIndex: number;
                    label: string;
                    inputType: import("@prisma/client").$Enums.InputType;
                    placeholder: string | null;
                    isRequired: boolean;
                    validationRules: import("@prisma/client/runtime/library").JsonValue | null;
                    sectionId: string;
                })[];
            } & {
                id: string;
                description: string | null;
                title: string;
                orderIndex: number;
                formVersionId: string;
            })[];
        } & {
            schema: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            isActive: boolean;
            description: string | null;
            versionNumber: number;
            title: string;
            status: import("@prisma/client").$Enums.FormVersionStatus;
            publishedAt: Date | null;
            formId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        slug: string | null;
        updatedAt: Date;
        createdBy: string | null;
    }>;
    getFormById(id: string): Promise<{
        versions: ({
            sections: ({
                questions: ({
                    options: {
                        id: string;
                        orderIndex: number;
                        optionLabel: string;
                        optionValue: string;
                        questionId: string;
                    }[];
                } & {
                    id: string;
                    orderIndex: number;
                    label: string;
                    inputType: import("@prisma/client").$Enums.InputType;
                    placeholder: string | null;
                    isRequired: boolean;
                    validationRules: import("@prisma/client/runtime/library").JsonValue | null;
                    sectionId: string;
                })[];
            } & {
                id: string;
                description: string | null;
                title: string;
                orderIndex: number;
                formVersionId: string;
            })[];
        } & {
            schema: import("@prisma/client/runtime/library").JsonValue | null;
            id: string;
            createdAt: Date;
            isActive: boolean;
            description: string | null;
            versionNumber: number;
            title: string;
            status: import("@prisma/client").$Enums.FormVersionStatus;
            publishedAt: Date | null;
            formId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        slug: string | null;
        updatedAt: Date;
        createdBy: string | null;
    }>;
    getActiveSchema(id: string): Promise<import("@prisma/client/runtime/library").JsonValue>;
    getActiveSchemaBySlug(slug: string): Promise<import("@prisma/client/runtime/library").JsonValue>;
    getVersions(id: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        description: string | null;
        versionNumber: number;
        title: string;
        status: import("@prisma/client").$Enums.FormVersionStatus;
        publishedAt: Date | null;
    }[]>;
    createVersion(formId: string, dto: CreateFormVersionDto): Promise<{
        sections: ({
            questions: ({
                options: {
                    id: string;
                    orderIndex: number;
                    optionLabel: string;
                    optionValue: string;
                    questionId: string;
                }[];
            } & {
                id: string;
                orderIndex: number;
                label: string;
                inputType: import("@prisma/client").$Enums.InputType;
                placeholder: string | null;
                isRequired: boolean;
                validationRules: import("@prisma/client/runtime/library").JsonValue | null;
                sectionId: string;
            })[];
        } & {
            id: string;
            description: string | null;
            title: string;
            orderIndex: number;
            formVersionId: string;
        })[];
    } & {
        schema: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        description: string | null;
        versionNumber: number;
        title: string;
        status: import("@prisma/client").$Enums.FormVersionStatus;
        publishedAt: Date | null;
        formId: string;
    }>;
    publishVersion(versionId: string): Promise<{
        schema: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        description: string | null;
        versionNumber: number;
        title: string;
        status: import("@prisma/client").$Enums.FormVersionStatus;
        publishedAt: Date | null;
        formId: string;
    } | null>;
    archiveVersion(versionId: string): Promise<{
        schema: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        description: string | null;
        versionNumber: number;
        title: string;
        status: import("@prisma/client").$Enums.FormVersionStatus;
        publishedAt: Date | null;
        formId: string;
    }>;
    updateCanvas(versionId: string, dto: CreateFormVersionDto): Promise<({
        sections: ({
            questions: ({
                options: {
                    id: string;
                    orderIndex: number;
                    optionLabel: string;
                    optionValue: string;
                    questionId: string;
                }[];
            } & {
                id: string;
                orderIndex: number;
                label: string;
                inputType: import("@prisma/client").$Enums.InputType;
                placeholder: string | null;
                isRequired: boolean;
                validationRules: import("@prisma/client/runtime/library").JsonValue | null;
                sectionId: string;
            })[];
        } & {
            id: string;
            description: string | null;
            title: string;
            orderIndex: number;
            formVersionId: string;
        })[];
    } & {
        schema: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        description: string | null;
        versionNumber: number;
        title: string;
        status: import("@prisma/client").$Enums.FormVersionStatus;
        publishedAt: Date | null;
        formId: string;
    }) | null>;
    submitResponse(formId: string, dto: SubmitResponseDto): Promise<{
        answers: {
            id: string;
            questionId: string;
            answerText: string | null;
            responseId: string;
            selectedOptionId: string | null;
        }[];
    } & {
        id: string;
        formId: string;
        formVersionId: string;
        submittedAt: Date;
        submittedBy: string | null;
    }>;
    getResponses(formId: string, page: number, limit: number): Promise<{
        total: number;
        page: number;
        limit: number;
        data: ({
            formVersion: {
                schema: import("@prisma/client/runtime/library").JsonValue;
                versionNumber: number;
            };
            answers: {
                id: string;
                questionId: string;
                answerText: string | null;
                responseId: string;
                selectedOptionId: string | null;
            }[];
        } & {
            id: string;
            formId: string;
            formVersionId: string;
            submittedAt: Date;
            submittedBy: string | null;
        })[];
    }>;
    getResponse(responseId: string): Promise<{
        formVersion: {
            schema: import("@prisma/client/runtime/library").JsonValue;
            versionNumber: number;
        };
        answers: {
            id: string;
            questionId: string;
            answerText: string | null;
            responseId: string;
            selectedOptionId: string | null;
        }[];
    } & {
        id: string;
        formId: string;
        formVersionId: string;
        submittedAt: Date;
        submittedBy: string | null;
    }>;
    getQuestionAnalytics(questionId: string): Promise<{
        questionId: string;
        textAnswers: number;
        optionCounts: (import("@prisma/client").Prisma.PickEnumerable<import("@prisma/client").Prisma.QuestionResponseGroupByOutputType, import("@prisma/client").Prisma.QuestionResponseScalarFieldEnum | import("@prisma/client").Prisma.QuestionResponseScalarFieldEnum[]> & {
            _count: true | {
                id?: number | undefined;
                responseId?: number | undefined;
                questionId?: number | undefined;
                answerText?: number | undefined;
                selectedOptionId?: number | undefined;
                _all?: number | undefined;
            } | undefined;
            _min: {
                id?: string | null | undefined;
                responseId?: string | null | undefined;
                questionId?: string | null | undefined;
                answerText?: string | null | undefined;
                selectedOptionId?: string | null | undefined;
            } | undefined;
            _max: {
                id?: string | null | undefined;
                responseId?: string | null | undefined;
                questionId?: string | null | undefined;
                answerText?: string | null | undefined;
                selectedOptionId?: string | null | undefined;
            } | undefined;
        })[];
    }>;
    getFormByTitleKeyword(keyword: string): Promise<{
        sections: ({
            questions: ({
                options: {
                    id: string;
                    orderIndex: number;
                    optionLabel: string;
                    optionValue: string;
                    questionId: string;
                }[];
            } & {
                id: string;
                orderIndex: number;
                label: string;
                inputType: import("@prisma/client").$Enums.InputType;
                placeholder: string | null;
                isRequired: boolean;
                validationRules: import("@prisma/client/runtime/library").JsonValue | null;
                sectionId: string;
            })[];
        } & {
            id: string;
            description: string | null;
            title: string;
            orderIndex: number;
            formVersionId: string;
        })[];
    } & {
        schema: import("@prisma/client/runtime/library").JsonValue | null;
        id: string;
        createdAt: Date;
        isActive: boolean;
        description: string | null;
        versionNumber: number;
        title: string;
        status: import("@prisma/client").$Enums.FormVersionStatus;
        publishedAt: Date | null;
        formId: string;
    }>;
}
