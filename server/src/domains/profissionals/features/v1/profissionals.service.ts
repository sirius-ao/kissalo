import { Injectable } from '@nestjs/common';
import { CreateProfessionalDto } from './dto/create-profissional.dto';
import { CreateProfissionalUseCase } from './useCase/createProfisionalUsecase';
import PrismaService from '@infra/database/prisma.service';
import { EmailService } from '@core/shared/utils/services/EmailService/Email.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';

@Injectable()
export class ProfissionalsService {
  constructor(
    private readonly database: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwt: JwtService,
    private readonly encript: BcryptService,
  ) {}

  public async create(data: CreateProfessionalDto) {
    const createUserFacede = new CreateProfissionalUseCase(
      this.database,
      this.emailService,
      this.encript,
      this.jwt,
    );
    return await createUserFacede.create(data);
  }

  findAll() {
    return `This action returns all profissionals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profissional`;
  }


  remove(id: number) {
    return `This action removes a #${id} profissional`;
  }
}
