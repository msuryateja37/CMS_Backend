import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateDressingEntryDto {
  @IsString()
  officeName: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  name: string;

  @IsString()
  natureOfInjury: string;

  @IsString()
  treatmentRendered: string;

  @IsOptional()
  @IsDateString()
  dateResumedWork?: string;

  @IsOptional()
  @IsUUID()
  incidentId?: string;
}
