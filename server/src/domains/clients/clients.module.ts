import { Global, Module } from '@nestjs/common';
import { ClientsService } from './features/v1/clients.service';
import { ClientsController } from './features/v1/clients.controller';

@Global()
@Module({
  controllers: [ClientsController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}
