import PrismaService from '@infra/database/prisma.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';
import { UserAlreadyExistExecption } from '@core/http/erros/user.error';
import { EmailServiceInterface } from '@core/shared/utils/services/EmailService/emailService.interface';
import { JwtService } from '@nestjs/jwt';
import { RequestActivation } from '@core/shared/utils/services/ActivationService/activation.service';

export class CreateclientUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly encript: BcryptService,
    private readonly emailService: EmailServiceInterface,
    private readonly jwt: JwtService,
  ) {}

  async create(dto: CreateClientDto) {
    const isAnUser = await this.database.user.findFirst({
      where: {
        OR: [
          {
            email: dto.email,
          },
          {
            phone: dto.phone,
          },
        ],
      },
    });
    if (isAnUser) {
      throw new UserAlreadyExistExecption();
    }

    const password = this.encript.encript(dto.password);
    const client = await this.database.user.create({
      data: {
        ...dto,
        password: password,
      },
    });

    const requestActivation = new RequestActivation(
      this.database,
      this.emailService,
      this.jwt,
    );
    return await requestActivation.request(client);
  }
}
