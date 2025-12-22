import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import PrismaService from '@infra/database/prisma.service';
import { GetclientUseCase } from './usecases/getUseCase';

@Injectable()
export class ClientsService {
  constructor(private readonly database: PrismaService) {}

  public async create(createClientDto: CreateClientDto) {
    return 'This action adds a new client';
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
