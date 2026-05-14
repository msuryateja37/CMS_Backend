// ─── Forms DTOs ────────────────────────────────────────────────────────────────

export class CreateOptionDto {
  optionLabel: string;
  optionValue: string;
  orderIndex?: number;
}

export class CreateQuestionDto {
  label: string;
  inputType: 'TEXT' | 'NUMBER' | 'DATE' | 'TEXTAREA' | 'RADIO' | 'CHECKBOX' | 'SELECT';
  placeholder?: string;
  isRequired?: boolean;
  orderIndex?: number;
  validationRules?: Record<string, any>;
  options?: CreateOptionDto[];
}

export class CreateSectionDto {
  title: string;
  description?: string;
  orderIndex?: number;
  questions?: CreateQuestionDto[];
}

export class CreateFormVersionDto {
  title: string;
  description?: string;
  sections?: CreateSectionDto[];
}

export class CreateFormDto {
  slug?: string;
  createdBy?: string;
  /** Inline first version — title is required */
  title: string;
  description?: string;
  sections?: CreateSectionDto[];
}

export class SubmitAnswerDto {
  questionId: string;
  answerText?: string;
  selectedOptionId?: string;
}

export class SubmitResponseDto {
  submittedBy?: string;
  answers: SubmitAnswerDto[];
}
