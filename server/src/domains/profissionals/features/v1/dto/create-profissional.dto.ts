
import { ISocialMedia } from '@core/shared/types';
import { ApiProperty } from '@nestjs/swagger';
import { ProfessionalType } from '@prisma/client';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  IsStrongPassword,
  IsUrl,
} from 'class-validator';

export class CreateProfissionalDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('AO')
  phone: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
  @ApiProperty({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  avatarUrl: string | undefined;
  @ApiProperty({
    enum: ProfessionalType,
  })
  @IsString()
  @IsNotEmpty()
  type: ProfessionalType;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  documentNumbe: string;
  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  yearsExperience: number;
  @ApiProperty({
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray({
    each: true,
    always: true,
  })
  specialties: string[];
  @ApiProperty({
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray({
    each: true,
    always: true,
  })
  certification: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsUrl()
  portfolioUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsUrl()
  coverUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsUrl()
  cvUrl: string;
  @ApiProperty({
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray({
    each: true,
    always: true,
  })
  contacts: number[];
  @ApiProperty({
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray({
    each: true,
    always: true,
  })
  socialMedia: ISocialMedia[];
}
