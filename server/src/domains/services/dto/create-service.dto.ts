// src/service-templates/dto/create-service.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ServicePriceType } from '@prisma/client';
import {
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'ID da categoria à qual este serviço pertence',
    example: 1,
  })
  @IsInt()
  categoryId: number;

  @ApiProperty({
    description: 'Título do serviço que será exibido para os usuários',
    example: 'Serviço de Limpeza Residencial',
  })
  @IsString()
  title: string;

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
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiProperty({
    description: 'Tipo de precificação do serviço',
    enum: ServicePriceType,
    example: ServicePriceType.FIXED,
  })
  @IsEnum(ServicePriceType)
  priceType: ServicePriceType;

  @ApiProperty({
    description: 'Define se o serviço está ativo e disponível para contratação',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
