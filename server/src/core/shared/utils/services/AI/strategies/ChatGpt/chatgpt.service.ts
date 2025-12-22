import { IAstrategy } from '../../ia.interface';

export class ChatGptService implements IAstrategy {
  private readonly key = process.env.OPEN_AI_KEY;

  public async gen(prompt: string): Promise<{ response: string }> {
    return await {
      response: prompt,
    };
  }
}
