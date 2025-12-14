import { Injectable } from '@nestjs/common';
import { ICryptoInterface } from './crypto.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements ICryptoInterface {
  private readonly salt = 10;
  encript(text: string): string {
    return bcrypt.hashSync(text, this.salt);
  }
  verify(hash: string, plainText: string): boolean {
    return bcrypt.compareSync(plainText, hash);
  }
}
