import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class KissaloLogger extends Logger {
  constructor(context: string) {
    super();
    this.context = 'KISSALO ' + context;
  }
}
