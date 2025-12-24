import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import PrismaService from '@infra/database/prisma.service';
import { GetclientUseCase } from './usecases/getUseCase';
import { CreateclientUseCase } from './usecases/createUseCase';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';
import { EmailService } from '@core/shared/utils/services/EmailService/Email.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ClientsService {
  constructor(
    private readonly database: PrismaService,
    private readonly encript: BcryptService,
    private readonly emailService: EmailService,
    private readonly jwt: JwtService,
  ) {}

  public async create(createClientDto: CreateClientDto) {
    const facede = new CreateclientUseCase(
      this.database,
      this.encript,
      this.emailService,
      this.jwt,
    );
    return await facede.create(createClientDto);
  }

  public async get(page: number, limit: number, userId: number) {
    const facede = new GetclientUseCase(this.database);
    return await facede.get(page, limit, userId);
  }
}
