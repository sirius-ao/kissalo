import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import PrismaService from '@infra/database/prisma.service';
import { GetclientUseCase } from './usecases/getUseCase';
import { CreateclientUseCase } from './usecases/createUseCase';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';

@Injectable()
export class ClientsService {
  constructor(
    private readonly database: PrismaService,
    private readonly encript: BcryptService,
  ) {}

  public async create(createClientDto: CreateClientDto) {
    const facede = new CreateclientUseCase(
      this.database,
      this.encript
    );
    return await facede.create(createClientDto);
  }

  public async get(page: number, limit: number, userId: number) {
    const facede = new GetclientUseCase(this.database);
    return await facede.get(page, limit, userId);
  }

  public async update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  public async togleStatus(id: number) {
    return `This action removes a #${id} client`;
  }
}
