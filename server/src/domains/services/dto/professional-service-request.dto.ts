import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProfessionalServiceRequestDto {
  @ApiProperty({
    description: 'Notas adicionais do administrador sobre a solicitação',
    example: 'Revisar portfólio antes da aprovação',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
