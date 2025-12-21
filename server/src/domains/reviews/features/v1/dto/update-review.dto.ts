import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  replay: string;
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  bookingId: number;
}
