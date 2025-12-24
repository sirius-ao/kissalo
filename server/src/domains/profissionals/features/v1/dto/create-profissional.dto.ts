import { ISocialMedia } from '@core/shared/types';
import { ApiProperty } from '@nestjs/swagger';
import { ProfessionalType } from '@prisma/client';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  IsUrl,
  Max,
  Min,
  arrayNotEmpty,
} from 'class-validator';

export class CreateProfessionalDto {
  @ApiProperty({ example: 'João' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Silva' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+244923000000' })
  @IsPhoneNumber('AO')
  phone: string;

  @ApiProperty({
    example: 'Senha@123',
    description: 'Mín. 8 caracteres, maiúscula, minúscula, número e símbolo',
  })
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({ required: false })
  @IsUrl()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ enum: ProfessionalType })
  @IsEnum(ProfessionalType)
  type: ProfessionalType;

  @ApiProperty({ example: 'Desenvolvedor Fullstack' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Especialista em sistemas web e mobile' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'BI123456789LA' })
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiProperty({ example: 5, minimum: 0, maximum: 50 })
  @IsInt()
  @Min(0)
  @Max(50)
  yearsExperience: number;

  @ApiProperty({ example: ['Node.js', 'NestJS', 'React'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  specialties: string[];

  @ApiProperty({ example: ['AWS Certified', 'Scrum Master'] })
  @IsArray()
  @IsString({ each: true })
  certification: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  portfolioUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  cvUrl?: string;

  @ApiProperty({
    example: ['+244923000000', '+244911000000'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsPhoneNumber('AO', { each: true })
  contacts: string[];

  @ApiProperty({
    example: [{ type: 'LINKEDIN', url: 'https://linkedin.com/in/joao' }],
  })
  @IsArray()
  @ArrayNotEmpty()
  socialMedia: ISocialMedia[];
}

export class UpdateProfessionalDto {

  @ApiProperty({ enum: ProfessionalType })
  @IsEnum(ProfessionalType)
  type: ProfessionalType;

  @ApiProperty({ example: 'Desenvolvedor Fullstack' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Especialista em sistemas web e mobile' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'BI123456789LA' })
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiProperty({ example: 5, minimum: 0, maximum: 50 })
  @IsInt()
  @Min(0)
  @Max(50)
  yearsExperience: number;

  @ApiProperty({ example: ['Node.js', 'NestJS', 'React'] })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  specialties: string[];

  @ApiProperty({ example: ['AWS Certified', 'Scrum Master'] })
  @IsArray()
  @IsString({ each: true })
  certification: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  portfolioUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  cvUrl?: string;

  @ApiProperty({
    example: ['+244923000000', '+244911000000'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsPhoneNumber('AO', { each: true })
  contacts: string[];

  @ApiProperty({
    example: [{ type: 'LINKEDIN', url: 'https://linkedin.com/in/joao' }],
  })
  @IsArray()
  @ArrayNotEmpty()
  socialMedia: ISocialMedia[];
}
export class CreateProfissionalDocumentsDto {
  @ArrayNotEmpty()
  @ApiProperty({
    isArray: true,
  })
  @IsArray({
    each: true,
  })
  files: string[];
}

export class UpdateProfissionalDocumentsDto {
  @IsInt()
  @ApiProperty()
  userId: number;
  @IsString()
  @IsOptional()
  @ApiProperty()
  notes?: string;
}
