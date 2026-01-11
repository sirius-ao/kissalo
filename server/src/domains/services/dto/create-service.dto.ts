import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  IsPositive,
  Min,
  Max,
  ArrayMinSize,
  ValidateIf,
} from 'class-validator';
import { ServicePriceType } from '@prisma/client';

export class CreateServiceTemplateDto {
  @ApiProperty({
    description: 'ID da categoria do serviço',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  categoryId: number;

  @ApiProperty({
    description: 'Título do serviço',
    example: 'Desenvolvimento de Site Institucional',
  })
  @IsString()
  @ApiProperty({
    description: 'Título do serviço',
    example: 'Desenvolvimento de Site Institucional',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição curta do serviço',
    example: 'Criação de site responsivo para sua empresa',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({
    description: 'Descrição completa do serviço',
    example: 'Desenvolvimento completo de site institucional com...',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Entregáveis do serviço',
    example: 'Layout responsivo, 5 páginas, formulário de contato',
  })
  @IsOptional()
  @IsString()
  deliverables?: string;

  @ApiProperty({
    description: 'Slug único para URL',
    example: 'desenvolvimento-site-institucional',
  })
  @IsString()
  slug: string;

  @ApiProperty({
    description: 'Palavras-chave para SEO',
    example: ['site', 'desenvolvimento', 'web'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  keywords: string[];

  @ApiProperty({
    description: 'Requisitos para solicitar o serviço',
    example: ['Briefing', 'Logotipo', 'Conteúdo'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  requirements: string[];

  @ApiPropertyOptional({
    description: 'URLs das imagens da galeria',
    example: ['image1.jpg', 'image2.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @ApiPropertyOptional({
    description: 'URL do banner do serviço',
    example: 'banner.jpg',
  })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiProperty({
    description: 'Preço base do serviço',
    example: 50000,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Duração em dias',
    example: 7,
  })
  @IsNumber()
  @IsPositive()
  duration: number;
}
