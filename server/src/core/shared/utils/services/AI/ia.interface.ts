export interface IAstrategy {
  gen(prompt: string): Promise<{ response: string }>;
}

export enum IAenum {
  CHATGPT = 'CHATGPT',
  GEMINI = 'GEMINI',
}
