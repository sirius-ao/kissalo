import { HttpException, HttpStatus } from '@nestjs/common';

export class SlugAlreadyExistExecption extends HttpException {
  constructor(title: string, entity: any) {
    super(
      {
        message: `Slug encontrado para ${title}`,
        cause: 'Slug existente',
        entity,
        name: `Slug existente , tente gerar um slug com  título diferente de ${title}`,
      },
      HttpStatus.CONFLICT,
    );
  }
}
