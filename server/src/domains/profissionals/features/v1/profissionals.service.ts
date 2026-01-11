import { Injectable } from '@nestjs/common';
import {
  CreateProfessionalDto,
  CreateProfissionalDocumentsDto,
  UpdateProfessionalDto,
  UpdateProfissionalDocumentsDto,
} from './dto/create-profissional.dto';
import { CreateProfissionalUseCase } from './useCase/createProfisionalUsecase';
import PrismaService from '@infra/database/prisma.service';
import { EmailService } from '@core/shared/utils/services/EmailService/Email.service';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';
import CacheService from '@infra/cache/cahe.service';
import { UpdateProfissionalUseCase } from './useCase/updateProfissionalUsecase';
import { CreateProfissionalVerificationUsecase } from './useCase/createVerificationRequestUsecase';
import { ToogleProfissionalUseCase } from './useCase/toogleProfissifionalUsecase';
import { CreateProfissionalDocumentUseCase } from './useCase/createProfissinalDocumentsUsecase';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { ProfissionalGetUseCase } from './useCase/getProfissionalsUseCase';

@Injectable()
export class ProfissionalsService {
  protected userGetter: ProfissionalGetUseCase;
  constructor(
    private readonly database: PrismaService,
    private readonly emailService: EmailService,
    private readonly jwt: JwtService,
    private readonly cache: CacheService,
    private readonly encript: BcryptService,
    private readonly notifier: NotificationFactory,
  ) {
    this.userGetter = new ProfissionalGetUseCase(this.database, this.cache);
  }
  public async create(data: CreateProfessionalDto) {
    const createUserFacede = new CreateProfissionalUseCase(
      this.database,
      this.emailService,
      this.encript,
      this.jwt,
    );
    return await createUserFacede.create(data);
  }
  public async createDocument(
    userId: number,
    data: CreateProfissionalDocumentsDto,
  ) {
    const useCase = new CreateProfissionalDocumentUseCase(
      this.database,
      this.notifier,
    );

    return await useCase.create(userId, data);
  }
  public async requestVerification(
    data: CreateProfissionalDocumentsDto,
    userId: number,
  ) {
    const requestVerificationFacade = new CreateProfissionalVerificationUsecase(
      this.database,
      this.emailService,
    );
    return await requestVerificationFacade.create(userId, data);
  }
  public async update(data: UpdateProfessionalDto, userId: number) {
    const update = new UpdateProfissionalUseCase(this.database);
    return await update.update(data, userId);
  }
  public async findAll() {
    return await this.userGetter.getAlls();
  }
  public async findOne(id: number) {
    return await this.userGetter.getOne(id);
  }
  public async tooleStatus(data: UpdateProfissionalDocumentsDto) {
    const useCase = new ToogleProfissionalUseCase(this.database, this.notifier);
    return await useCase.toogle(data.userId, data.notes);
  }
}
