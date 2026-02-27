import {
  IsString,
  IsOptional,
  IsUUID,
  IsISO8601,
  IsBoolean,
} from 'class-validator';

export class UpdateCaseDto {
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
  assignedToId?: string;

  @IsOptional()
  @IsUUID()
  currentStateId?: string;

  @IsOptional()
  @IsUUID()
  buildingId?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;
}
