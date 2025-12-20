export interface ISlug {
  gen(title: string, entity: 'category' | 'service'): Promise<string>;
}
