import { PartialType } from '@nestjs/swagger';
import { CreateServiceTemplateDto } from './create-service.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateServiceTemplateDto extends PartialType(
  CreateServiceTemplateDto,
) {
  @ApiPropertyOptional({
    description: 'Contador de visualizações',
    example: 150,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  viewsCount?: number;

  @ApiPropertyOptional({
    description: 'Contador de reservas',
    example: 25,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bookingsCount?: number;

  @ApiPropertyOptional({
    description: 'Média de avaliações',
    example: 4.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  ratingAverage?: number;

  @ApiPropertyOptional({
    description: 'Número de avaliações',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  ratingCount?: number;
}
