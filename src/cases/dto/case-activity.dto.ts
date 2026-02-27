import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCaseActivityDto {
  @IsString()
  activityType: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsUUID()
  performedById?: string;
}

export class CaseActivityResponseDto {
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
