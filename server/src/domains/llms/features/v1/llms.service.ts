import { Injectable } from '@nestjs/common';
import { IAFactory } from '@core/shared/utils/services/AI/ia.factory';
import { IAenum } from '@core/shared/utils/services/AI/ia.interface';
import { PixeBayService } from '@core/shared/utils/services/AI/pixebay.service';

@Injectable()
export class LlmsService {
  constructor(private readonly PixeBayService: PixeBayService) {}
  private readonly gemini = IAFactory.create('GEMINI' as IAenum);

  public async genImages(basedTitle: string) {
    return await this.PixeBayService.getImages(basedTitle);
  }
  public async replayPrompt(prompt: string, type: string) {
    return await this.gemini.gen(prompt, type as any);
  }
}
