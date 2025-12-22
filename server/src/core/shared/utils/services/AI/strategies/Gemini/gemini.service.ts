import { BadRequestException } from '@nestjs/common';
import { IAstrategy } from '../../ia.interface';
import { GoogleGenAI } from '@google/genai';
export class GeminiService implements IAstrategy {
  private readonly Gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
  public async gen(
    serviceName: string,
    type: 'service' | 'category',
  ): Promise<{ response: string }> {
    try {
      const prompt = `
Gere uma única descrição curta e atrativa para o seguinte ${type.includes('ser') ? 'serviço prestado' : 'categoria de serviços prestados'}, apenas a descrição final, sem numerar, sem listas, sem explicações:

Nome do ${type.includes('ser') ? 'serviço prestado' : 'categoria de serviços'}: ${serviceName}

A descrição deve:
- Destacar a qualidade e confiabilidade do serviço
- Mencionar benefícios como rapidez, segurança e experiência
- Ser clara e persuasiva, com no máximo 2 frases
`;

      const response = await this.Gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${prompt}`,
      });
      return {
        response: response?.text,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Erro ao gerar descrição , tente mais tarde',
      );
    }
  }
}
