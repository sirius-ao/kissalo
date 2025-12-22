import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @ApiProperty({
    example: 'BAI',
  })
  @IsNotEmpty()
  bankName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accountNumber: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accountHolder: string;
}
