import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundExecption extends HttpException {
  constructor() {
    super(
      {
        message:
          'Conta não encontrada, seu email ou telefone ainda não foram registrados',
        cause: 'Seu email ou telefone ainda não foram registrados',
        name: 'Conta não encontrada',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
export class UserNotVerifiedExecption extends HttpException {
  constructor() {
    super(
      {
        message:
          'Consulte seu email , enviamos para si um link de verificação da sua conta',
        cause: 'Conta não verificada',
        name: 'Conta não verificada',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
