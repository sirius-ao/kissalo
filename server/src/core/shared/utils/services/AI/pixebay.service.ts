import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class PixeBayService {
  private readonly PIXABAY_API = process.env.PIXABAY_API;

  public async getImages(basedTitle: string) {
    if (this.PIXABAY_API) {
      throw new BadRequestException('PIXABAY_API não definido');
    }
    try {
      const apiCall = await fetch(`${this.PIXABAY_API + basedTitle}`);
      const res = await apiCall.json();
      return {
        images: res,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'Erro ao buscar imagens',
        error,
      });
    }
  }
}
