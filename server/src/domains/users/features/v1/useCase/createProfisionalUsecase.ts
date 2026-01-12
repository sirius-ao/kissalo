import { ICryptoInterface } from '@core/shared/utils/services/CryptoService/crypto.interface';
import { EmailServiceInterface } from '@core/shared/utils/services/EmailService/emailService.interface';
import PrismaService from '@infra/database/prisma.service';
import { CreateProfessionalDto } from '../dto/create-profissional.dto';
import { UserAlreadyExistExecption } from '@core/http/erros/user.error';
import constants from '@core/constants';
import { JwtService } from '@nestjs/jwt';
import { RequestActivation } from '@core/shared/utils/services/ActivationService/activation.service';
import CacheService from '@infra/cache/cahe.service';

export class CreateProfissionalUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
    private readonly encript: ICryptoInterface,
    private readonly jwt: JwtService,
  ) {}

  public async create(data: CreateProfessionalDto) {
    const pass = this.encript.encript(data.password);
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
        isEmailVerified: true,
        role: data?.role == 'CUSTOMER' ? 'CUSTOMER' : 'PROFESSIONAL',
        stats: JSON.stringify(constants.STATS.PROFISSIONAL),
        phone: data.phone,
        status: 'ACTIVE',
        password: pass,
      },
    });

    if (createdUser?.role == 'PROFESSIONAL') {
      await this.database.professional.create({
        data: {
          userId: createdUser.id,
          documentNumber: '',
          type: 'INDIVIDUAL',
          yearsExperience: 0,
          averageRating: 0,
          certifications: [],
          contacts: [],
          cvUrl: '',
          coverUrl: '',
          specialties: [],
          isVerified: true,
          title: '',
          socialMedia: {},
          stats: JSON.stringify(constants.STATS.PROFISSIONAL),
          portfolioUrl: '',
          description: '',
        },
      });
    }

    const ONE_HOUR = 1000 * 60 * 60;
    const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14;

    const [acessToken, refreshToken] = [
      this.jwt.sign(
        {
          sub: createdUser.id,
        },
        {
          expiresIn: '1h',
        },
      ),
      this.jwt.sign(
        {
          sub: createdUser.id,
          role: createdUser.role,
        },
        {
          expiresIn: '14d',
        },
      ),
    ];
    const { password, ...userPublicData } = createdUser;
    await Promise.all([
      this.cache.set(`userProfile-${createdUser.id}`, userPublicData, ONE_HOUR),
      this.cache.set(`userRefreshToken-${createdUser.id}`, refreshToken, TWO_WEEKS),
    ]);
    return {
      user: userPublicData,
      acessToken,
    };
  }
}
