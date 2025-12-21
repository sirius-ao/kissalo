import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  bookingId: number;
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;
}
