import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginUseCase } from './Usecases/loginUsecase';
import { KissaloLogger } from '@core/shared/utils/services/Logger/logger.service';
import PrismaService from '@infra/database/prisma.service';
import { EmailService } from '@core/shared/utils/services/EmailService/Email.service';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';
import { JwtService } from '@nestjs/jwt';
import CacheService from '@infra/cache/cahe.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: PrismaService,
    private readonly encript: BcryptService,
    private readonly emailService: EmailService,
    private readonly logger: KissaloLogger,
    private readonly jwt: JwtService = new JwtService({
      secret: process.env.JWT_SECRET,
    }),
    private readonly cache: CacheService,
  ) {}

  public async login(data: CreateAuthDto) {
    
    const useCase = new LoginUseCase(
      this.database,
      this.encript,
      this.emailService,
      this.logger,
    );
    const useCaseResponse = await useCase.handle(data);
    const { user } = useCaseResponse;
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
          expiresIn: '1m',
        },
      ),
    ];
    await Promise.all([
      this.cache.set(`userProfile-${user.id}`, user, 36000 * 5),
      this.cache.set(
        `userRefreshToken-${user.id}`,
        refreshToken,
        36000 * 24 * 30,
      ),
    ]);
    return {
      user: {
        ...user,
        password: null,
      },
      acessToken,
    };
  }

  public async verify(token: string) {

  }
  
  public async refresh(token: string) { }
  
  public async recoveryRequest(unique: string) { }
  
  public async resetPassword() { }
  
  public async logout(userid: number) {
    await Promise.all([
      this.cache.delete(`userProfile-${userid}`),
      this.cache.delete(`userRefreshToken-${userid}`),
    ]);
    return {
      message: 'Deslogado com sucesso do sistema',
    };
  }
}
