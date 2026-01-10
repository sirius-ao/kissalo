import PrismaService from '@infra/database/prisma.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';
import { UserAlreadyExistExecption } from '@core/http/erros/user.error';
import { JwtService } from '@nestjs/jwt';
import CacheService from '@infra/cache/cahe.service';

export class CreateclientUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly encript: BcryptService,
    private readonly cache: CacheService,
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
    const newPassword = this.encript.encript(dto.password);
    const user = await this.database.user.create({
      data: {
        ...dto,
        password: newPassword,
        isEmailVerified: true,
        role: 'CUSTOMER',
      },
    });

    const TWO_WEEKS = 60 * 60 * 24 * 14;
    const [acessToken, refreshToken] = [
      this.jwt.sign(
        {
          sub: user.id,
        },
        {
          expiresIn: '1h',
        },
      ),
      this.jwt.sign(
        {
          sub: user.id,
          role: user.role,
        },
        {
          expiresIn: '14d',
        },
      ),
    ];
    const { password, ...userPublicData } = user;
    await Promise.all([
      this.cache.set(`userProfile-${user.id}`, userPublicData, 60 * 60 * 1),
      this.cache.set(`userRefreshToken-${user.id}`, refreshToken, TWO_WEEKS),
    ]);
    return {
      user: userPublicData,
      acessToken,
    };
  }
}
