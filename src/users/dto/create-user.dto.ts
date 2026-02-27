import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  fullName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  employeeCode?: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  roleId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  provinceId?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
