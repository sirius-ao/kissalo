import { Image } from '@core/shared/types';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class PixeBayService {
  private readonly PIXABAY_API = process.env.PIXABAY_API;

  public async getImages(basedTitle: string) {
    if (!this.PIXABAY_API) {
      throw new BadRequestException('PIXABAY_API não definido');
    }
    try {
      const apiCall = await fetch(`${this.PIXABAY_API + basedTitle}`);
      const res = (await apiCall.json()) as {
        hits: Image[];
        total: number;
        totalHits: number;
      };

      if (Array.isArray(res?.hits) && res.hits.length > 0) {
        const data = res?.hits?.map((image: Image) => {
          return {
            id: image.id,
            imageSize: image.imageSize,
            imageHeight: image.imageHeight,
            largeImageURL: image.largeImageURL,
            imageWidth: image.imageWidth,
            previewURL: image.previewURL,
            type: image.type,
            tags: image.tags.split(','),
            webformatURL: image.webformatURL,
          };
        });
        return {
          Images: data,
          total: res?.total,
        };
      }
      return {
        Images: [],
        total: 0,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException({
        message: 'Erro ao buscar imagens',
        error,
      });
    }
  }
}
