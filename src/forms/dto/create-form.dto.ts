import { IsString, IsOptional, IsArray, ValidateNested, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

// ─── Forms DTOs ────────────────────────────────────────────────────────────────

export class CreateOptionDto {
  @IsString()
  optionLabel: string;

  @IsString()
  optionValue: string;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;
}

export class CreateQuestionDto {
  @IsString()
  label: string;

  @IsString()
  inputType: 'TEXT' | 'NUMBER' | 'DATE' | 'TEXTAREA' | 'RADIO' | 'CHECKBOX' | 'SELECT';

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;

  @IsOptional()
  validationRules?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  options?: CreateOptionDto[];
}

export class CreateSectionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions?: CreateQuestionDto[];
}

export class CreateFormVersionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSectionDto)
  sections?: CreateSectionDto[];
}

export class CreateFormDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  /** Inline first version — title is required */
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSectionDto)
  sections?: CreateSectionDto[];
}

export class SubmitAnswerDto {
  @IsString()
  questionId: string;

  @IsOptional()
  @IsString()
  answerText?: string;

  @IsOptional()
  @IsString()
  selectedOptionId?: string;
}

export class SubmitResponseDto {
  @IsOptional()
  @IsString()
  submittedBy?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers: SubmitAnswerDto[];
}
