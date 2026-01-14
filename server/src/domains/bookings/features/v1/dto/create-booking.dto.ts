import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingPriority, ServiceLocation } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { IAddress } from '@core/shared/types';

export class CreateBookingDto {
  @ApiProperty({
    description: 'ID do serviço',
    example: 5,
  })
  @IsInt()
  @IsNotEmpty()
  serviceId: number;

  @ApiProperty({
    description: 'Data do agendamento (YYYY-MM-DD)',
    example: '2025-01-20',
  })
  @IsDateString()
  scheduleDate: string;

  @ApiProperty({
    description: 'Hora de início (ISO 8601)',
    example: '2025-01-20T09:00:00.000Z',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'Hora de término (ISO 8601)',
    example: '2025-01-20T10:00:00.000Z',
  })
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: 'Local do serviço',
    enum: ServiceLocation,
    example: ServiceLocation.CLIENT_HOME,
  })
  @IsEnum(ServiceLocation)
  location: ServiceLocation;

  @ApiProperty({
    description: 'Endereço do serviço',
    example: {
      street: 'Rua Principal',
      city: 'Luanda',
      country: 'Angola',
    },
  })
  @IsObject()
  address: IAddress;

  @IsEnum(BookingPriority)
  @IsNotEmpty()
  @ApiProperty({
    enum: BookingPriority,
  })
  priority: BookingPriority;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  fileUrl: string;
  @IsString()
  @IsNotEmpty()
  method: string;
}

export class CreateStepsDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  notes: string;
  @ApiProperty({
    description: 'Anexos ',
  })
  @IsArray()
  files: string[];
}
