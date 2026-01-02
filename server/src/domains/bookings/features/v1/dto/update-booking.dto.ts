import { ApiHideProperty, ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import {
  IsArray,
  IsEmpty,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}

export enum UpdateBookinSatatusProfisionalEnum {
  'ACCEPTED' = 'ACCEPTED',
  'REJECTED' = 'REJECTED',
  'STARTED' = 'STARTED',
  'COMPLETED' = 'COMPLETED',
  'CANCELED' = 'CANCELED',
}

export class UpdateBookinStatus {
  @IsEnum(UpdateBookinSatatusProfisionalEnum)
  @IsNotEmpty()
  @ApiProperty({
    enum: UpdateBookinSatatusProfisionalEnum,
  })
  status: UpdateBookinSatatusProfisionalEnum;
  @ApiProperty({
    description: 'Mensagem ',
  })
  @IsString()
  @IsOptional()
  notes: string;
  @ApiProperty({
    description: 'Anexos ',
  })
  @IsArray()
  files: string[];
}
