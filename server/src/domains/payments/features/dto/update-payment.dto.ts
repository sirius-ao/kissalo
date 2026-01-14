import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export enum PaymentUpdateStatus {
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export class UpdatePaymentDto {
  @IsEnum(PaymentUpdateStatus)
  @ApiProperty({
    description: 'Novo status do pagamento',
    enum: PaymentUpdateStatus,
    required: false,
    example: PaymentUpdateStatus.PAID,
  })
  @IsNotEmpty()
  status: PaymentUpdateStatus;
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Notas do administrador sobre a atualização do pagamento',
    required: false,
    example: 'Pagamento confirmado após análise do comprovante',
  })
  notes?: string;
}
