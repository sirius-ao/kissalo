import { IAstrategy } from '../../ia.interface';

export class GeminiService implements IAstrategy {
  private readonly key = process.env.GEMINI_KEY;

  public async gen(prompt: string): Promise<{ response: string }> {
    return await {
      response: prompt,
    };
  }
}
