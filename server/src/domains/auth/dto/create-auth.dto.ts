import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Email or Phone Number',
  })
  unique: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
