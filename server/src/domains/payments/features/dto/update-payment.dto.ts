import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';

export enum PaymentUpdateStatus {
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentUpdateStatus)
  @ApiProperty({
    description: 'Novo status do pagamento',
    enum: PaymentUpdateStatus,
    required: false,
    example: PaymentUpdateStatus.PAID,
  })
  status?: PaymentUpdateStatus;

  @IsOptional()
  @IsString()
  @IsUrl()
  @ApiProperty({
    description: 'URL do comprovante de pagamento atualizado',
    required: false,
    example: 'https://example.com/new-payment-proof.pdf',
  })
  fileUrl?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Método de pagamento atualizado',
    required: false,
    example: 'Multicaixa',
  })
  method?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Notas do administrador sobre a atualização do pagamento',
    required: false,
    example: 'Pagamento confirmado após análise do comprovante',
  })
  notes?: string;
}
