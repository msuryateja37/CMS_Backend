export declare class CreateCaseActivityDto {
    activityType: string;
    description: string;
    performedById?: string;
}
export declare class CaseActivityResponseDto {
    id: string;
    caseId: string;
    activityType: string;
    description: string;
    performedById?: string;
    performedBy?: {
        id: string;
        fullName: string;
        email: string;
    };
    createdAt: Date;
}
