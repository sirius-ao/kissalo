import { ICryptoInterface } from '@core/shared/utils/services/CryptoService/crypto.interface';
import { EmailServiceInterface } from '@core/shared/utils/services/EmailService/emailService.interface';
import PrismaService from '@infra/database/prisma.service';
import { CreateProfessionalDto } from '../dto/create-profissional.dto';
import { UserAlreadyExistExecption } from '@core/http/erros/user.error';
import constants from '@core/constants';
import { JwtService } from '@nestjs/jwt';
import { RequestActivation } from '@core/shared/utils/services/ActivationService/activation.service';

export class CreateProfissionalUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly emailservice: EmailServiceInterface,
    private readonly encript: ICryptoInterface,
    private readonly jwt: JwtService,
  ) {}

  public async create(data: CreateProfessionalDto) {
    const password = this.encript.encript(data.password);

    const isAnUser = await this.database.user.findFirst({
      where: {
        OR: [
          {
            email: data.email,
          },
          {
            phone: data.phone,
          },
        ],
      },
    });
    if (isAnUser) {
      throw new UserAlreadyExistExecption();
    }
    const createdUser = await this.database.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUrl: data.avatarUrl,
        isEmailVerified: false,
        role: 'PROFESSIONAL',
        stats: JSON.stringify(constants.STATS.PROFISSIONAL),
        phone: data.phone,
        status: 'ACTIVE',
        password,
      },
    });
    await this.database.professional.create({
      data: {
        userId: createdUser.id,
        documentNumber: data.documentNumber,
        type: data.type,
        yearsExperience: data.yearsExperience,
        averageRating: 0,
        certifications: data.certification,
        contacts: data.contacts,
        cvUrl: data.cvUrl,
        coverUrl: data.coverUrl,
        specialties: data.specialties,
        isVerified: false,
        title: data.title,
        socialMedia: JSON.stringify(data.socialMedia),
        stats: JSON.stringify(constants.STATS.PROFISSIONAL),
        portfolioUrl: data.portfolioUrl,
        description: data.description,
      },
    });
    const requestActivation = new RequestActivation(
      this.database,
      this.emailservice,
      this.jwt,
    );
    await requestActivation.request(createdUser);
  }
}
