export interface IAstrategy {
  gen(
    prompt: string,
    type: 'service' | 'category',
  ): Promise<{ response: string }>;
}

export enum IAenum {
  CHATGPT = 'CHATGPT',
  GEMINI = 'GEMINI',
}
