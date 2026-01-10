import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundExecption extends HttpException {
  constructor() {
    super(
      {
        message:
          'Conta não encontrada, seu email , Id ou telefone ainda não foram registrados',
        cause: 'Seu email , ID ou telefone ainda não foram registrados',
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
      HttpStatus.FORBIDDEN,
    );
  }
}

export class UserAlreadyExistExecption extends HttpException {
  constructor() {
    super(
      {
        message: 'Usuário existente , tente com outros dados',
        cause: 'Usuário existente',
        name: 'Usuário existente',
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class AdminNotFoundExistExecption extends HttpException {
  constructor() {
    super(
      {
        message:
          'Admininstrador do sistema não existente , tente com outros dados',
        cause: 'Admininstrador do sistema não existente',
        name: 'Admininstrador do sistema não existente',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
