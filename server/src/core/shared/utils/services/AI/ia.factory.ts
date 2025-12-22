import { Injectable } from '@nestjs/common';
import { IAenum, IAstrategy } from './ia.interface';
import { GeminiService } from './strategies/Gemini/gemini.service';

@Injectable()
export class IAFactory {
  static create(provider: IAenum): IAstrategy {
    switch (provider) {
      case 'GEMINI':
        return new GeminiService();
        break;
      default:
        throw new Error('Ia não suportado');
        break;
    }
  }
}
