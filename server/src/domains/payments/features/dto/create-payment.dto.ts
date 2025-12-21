import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID do agendamento', example: 1 })
  bookingId: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'ID do profissional',
    example: 2,
    required: false,
  })
  professionalId?: number;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    description: 'URL do comprovante de pagamento',
    example: 'https://example.com/payment-proof.pdf',
    required: false,
  })
  fileUrl?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Método de pagamento', example: 'Multicaixa' })
  method: string;
}
