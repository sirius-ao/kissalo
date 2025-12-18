import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
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

export class CreateCostumerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Nome do cliente',
  })
  firstName: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Sobrenome do cliente',
  })
  lastName: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Email do cliente',
  })
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Telefone do cliente',
  })
  @IsPhoneNumber('AO')
  phone: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Nome do cliente',
  })
  @IsStrongPassword(undefined, {
    message: 'Senha fraca',
  })
  password: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Nome do cliente',
  })
  avatarUrl: string;
}
