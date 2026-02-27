import {
  IsString,
  IsOptional,
  IsUUID,
  IsISO8601,
  IsBoolean,
} from 'class-validator';

export class CreateCaseDto {
  @IsOptional()
  @IsString()
  caseNumber?: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  @IsString()
  severityLevel?: string;

  @IsOptional()
  @IsString()
  priorityLevel?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsISO8601()
  occurredAt?: string;

  @IsOptional()
  @IsISO8601()
  dueDate?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsBoolean()
  isEscalated?: boolean;

  @IsOptional()
  @IsBoolean()
  isOffline?: boolean;

  @IsOptional()
  @IsUUID()
  buildingId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  provinceId?: string;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;
}
