import { PrismaService } from '../prisma/prisma.service';
export declare class FormsService {
    private prisma;
    constructor(prisma: PrismaService);
    getForms(): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        description: string | null;
        title: string;
        version: string | null;
        createdBy: string | null;
        updatedAt: Date;
    }[]>;
    getFormById(id: string): Promise<{
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
                inputType: string;
                placeholder: string | null;
                validationRules: import("@prisma/client/runtime/client").JsonValue | null;
                sectionId: string;
            })[];
        } & {
            id: string;
            title: string;
            orderIndex: number;
            formId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        isActive: boolean;
        description: string | null;
        title: string;
        version: string | null;
        createdBy: string | null;
        updatedAt: Date;
    }>;
    createForm(data: any): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        description: string | null;
        title: string;
        version: string | null;
        createdBy: string | null;
        updatedAt: Date;
    }>;
    submitResponse(formId: string, data: any): Promise<{
        id: string;
        submittedBy: string | null;
        submittedAt: Date;
        formId: string;
    }>;
}
