import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsBoolean,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category title',
    example: 'Eletricidade',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Category slug (lowercase, sem espaços)',
    example: 'eletricidade',
  })
  @ApiProperty({
    description: 'Category description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Category color (hex)',
    example: '#FFAA00',
  })
  @IsNotEmpty()
  @IsString()
  color: string;

  @ApiProperty({
    description: 'Category order',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  order: number;
}
