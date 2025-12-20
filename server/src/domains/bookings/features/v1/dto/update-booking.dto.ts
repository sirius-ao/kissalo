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
  'ACEPTED' = 'ACEPTED',
  'REJECTED' = 'REJECTED',
}

export class UpdateBookinSatatusProfisional {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  bookingId: number;
  @IsEmpty()
  @ApiHideProperty()
  userId: number;
  @IsEnum(UpdateBookinSatatusProfisionalEnum)
  @IsNotEmpty()
  @ApiProperty({
    enum: UpdateBookinSatatusProfisionalEnum,
  })
  status: 'ACEPTED' | 'REJECTED';

  @ApiProperty({
    description: 'Mensagem ',
    example: 5,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({
    description: 'Anexos ',
    example: 5,
    nullable: true,
  })
  @IsArray()
  files: string[];
}
