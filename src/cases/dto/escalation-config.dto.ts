import { IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateCaseEscalationConfigDto {
  @IsOptional()
  @IsInt()
  escalateAfterHours?: number;

  @IsOptional()
  @IsBoolean()
  notifyEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  notifySms?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyApp?: boolean;
}

export class UpdateCaseEscalationConfigDto {
  @IsOptional()
  @IsInt()
  escalateAfterHours?: number;

  @IsOptional()
  @IsBoolean()
  notifyEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  notifySms?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyApp?: boolean;
}
