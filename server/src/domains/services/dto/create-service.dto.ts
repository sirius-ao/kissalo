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

<<<<<<< HEAD
  @ApiPropertyOptional({
    description: 'Descrição curta do serviço',
    example: 'Criação de site responsivo para sua empresa',
=======
  @ApiProperty({
    description:
      'Descrição detalhada do serviço, explicando o que está incluído',
    example:
      'Serviço completo de limpeza para casas e apartamentos, incluindo quartos, salas e cozinha.',
  })
  @IsString()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description:
      'Lista de tags para facilitar a busca e categorização do serviço',
    example: ['limpeza', 'residencial', 'padrão'],
  })
  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @ApiProperty({
    description: 'Preço base do serviço em centavos (ex: 5000 = 50,00)',
    example: 5000,
  })
  @IsInt()
  @Min(0)
  basePrice: number;

  @ApiProperty({
    description: 'Duração estimada do serviço em minutos',
    example: 60,
    required: false,
>>>>>>> 8969769 (feat : Slug Service)
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
    description: 'URL do vídeo demonstrativo',
    example: 'https://youtube.com/watch?v=example',
  })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiPropertyOptional({
    description: 'URL do banner do serviço',
    example: 'banner.jpg',
  })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({
    description: 'Se o preço é negociável',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isNegotiable?: boolean;

  @ApiPropertyOptional({
    description: 'Se requer aprovação prévia',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @ApiProperty({
    description: 'Preço base do serviço',
    example: 50000,
  })
  @IsNumber()
  @IsPositive()
  basePrice: number;

  @ApiPropertyOptional({
    description: 'Preço mínimo (se negociável)',
    example: 30000,
  })
  @ValidateIf((o) => o.isNegotiable)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Preço máximo (se negociável)',
    example: 80000,
  })
  @ValidateIf((o) => o.isNegotiable)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxPrice?: number;

  @ApiProperty({
    description: 'Tipo de preço',
    enum: ServicePriceType,
    example: ServicePriceType.FIXED,
  })
  @IsEnum(ServicePriceType)
  priceType: ServicePriceType;

  @ApiPropertyOptional({
    description: 'Moeda (padrão: AOA)',
    default: 'AOA',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Duração em dias',
    example: 7,
  })
  @IsNumber()
  @IsPositive()
  duration: number;

  @ApiPropertyOptional({
    description: 'Se o serviço está ativo',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Se o serviço é destacado',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Máximo de solicitações por dia',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxRequestsPerDay?: number;

  @ApiPropertyOptional({
    description: 'Máximo de reservas simultâneas',
    example: 5,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxBookings?: number;
}
