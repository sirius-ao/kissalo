import { Injectable } from '@nestjs/common';
import { CreateAuthDto, CreateCostumerDto } from './dto/create-auth.dto';
import { LoginUseCase } from './Usecases/loginUsecase';
import PrismaService from '@infra/database/prisma.service';
import { EmailService } from '@core/shared/utils/services/EmailService/Email.service';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';
import { JwtService } from '@nestjs/jwt';
import CacheService from '@infra/cache/cahe.service';
import { RequestRecoveryUsecase } from './Usecases/requestRecoveryUsecase';
import { ResetPasswordUsecase } from './Usecases/resetPasswordUsecase';
import { RefreshTokenUseCase } from './Usecases/refreshTokenUsecase';

@Injectable()
export class AuthService {
  private readonly jwt: JwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });
  constructor(
    private readonly database: PrismaService,
    private readonly encript: BcryptService,
    private readonly emailService: EmailService,
    private readonly cache: CacheService,
  ) {}

  public async login(data: CreateAuthDto) {
    const useCase = new LoginUseCase(
      this.database,
      this.encript,
      this.emailService,
      this.cache,
      this.jwt,
    );
    return await useCase.handle(data);
  }
  
  public async verify(token: string) {}

  public async refresh(token: string) {
    const useCase = new RefreshTokenUseCase(
      this.database,
      this.jwt,
      this.cache,
    );
    return await useCase.process(token);
  }

  public async recoveryRequest(unique: string) {
    const useCase = new RequestRecoveryUsecase(
      this.database,
      this.emailService,
      this.jwt,
    );
    return await useCase.request(unique);
  }

  public async resetPassword(token: string, password: string) {
    const encriptPass = this.encript.encript(password);
    const useCase = new ResetPasswordUsecase(
      this.database,
      this.emailService,
      this.jwt,
    );
    return await useCase.rest(token, encriptPass);
  }

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
