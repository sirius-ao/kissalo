import { Global, Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';

@Global()
@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
