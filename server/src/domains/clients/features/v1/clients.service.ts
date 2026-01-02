import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import PrismaService from '@infra/database/prisma.service';
import { GetclientUseCase } from './usecases/getUseCase';
import { CreateclientUseCase } from './usecases/createUseCase';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';
import { JwtService } from '@nestjs/jwt';
import CacheService from '@infra/cache/cahe.service';

@Injectable()
export class ClientsService {
  constructor(
    private readonly database: PrismaService,
    private readonly encript: BcryptService,
    private readonly jwt: JwtService,
    private readonly cache: CacheService,
  ) {}

  public async create(createClientDto: CreateClientDto) {
    const facede = new CreateclientUseCase(
      this.database,
      this.encript,
      this.cache,
      this.jwt,
    );
    return await facede.create(createClientDto);
  }

  public async get(page: number, limit: number, userId: number) {
    const facede = new GetclientUseCase(this.database);
    return await facede.get(page, limit, userId);
  }
}
