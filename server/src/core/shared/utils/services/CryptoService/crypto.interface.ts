export interface ICryptoInterface {
  encript(text: string): string;
  verify(hash: string, plainText: string): boolean;
}
