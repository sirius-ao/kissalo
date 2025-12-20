import { HttpException, HttpStatus } from '@nestjs/common';

export class ProfissionalNotVerifiedExecption extends HttpException {
  constructor(name: string) {
    super(
      {
        message: `O profissional ${name} ainda não foi verificado , por favor aguarde a verificação deste profissional , para poder efectuar esta ação`,
        cause: 'Profissional não verificado',
        name: 'Profissional não verificado',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
export class ProfissionalNotFoundExecption extends HttpException {
  constructor(name: string) {
    super(
      {
        message: `O profissional ${name} não foi encontrado`,
        cause: 'Profissional não encotrado',
        name: 'Profissional não encotrado',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
