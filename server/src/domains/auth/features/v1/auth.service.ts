import { Injectable } from '@nestjs/common';
import {
  CreateAuthDto,
  ResetPasswordDto,
  UpateCredentials,
  UpdateProfileDto,
} from './dto/create-auth.dto';
import { LoginUseCase } from './Usecases/loginUsecase';
import PrismaService from '@infra/database/prisma.service';
import { EmailService } from '@core/shared/utils/services/EmailService/Email.service';
import { BcryptService } from '@core/shared/utils/services/CryptoService/crypto.service';
import { JwtService } from '@nestjs/jwt';
import CacheService from '@infra/cache/cahe.service';
import { RequestRecoveryUsecase } from './Usecases/requestRecoveryUsecase';
import { ResetPasswordUsecase } from './Usecases/resetPasswordUsecase';
import { RefreshTokenUseCase } from './Usecases/refreshTokenUsecase';
import { VerifyAcountUseCase } from './Usecases/verifyAcountUsecase';
import { UpdateProfileUseCase } from './Usecases/updateProfileUseCase';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { MeUseCase } from './Usecases/meUseCase';

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
    private readonly notifier: NotificationFactory,
  ) {}

  public async me(userId: number) {
    const useCase = new MeUseCase(this.database, this.cache);
    return await useCase.getMe(userId);
  }
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

  public async update(data: UpdateProfileDto, userId: number) {
    const useCase = new UpdateProfileUseCase(
      this.database,
      this.encript,
      this.notifier,
      this.cache,
    );
    return await useCase.updateProfile(userId, data);
  }

  public async updateCredentials(data: UpateCredentials, userId: number) {
    const useCase = new UpdateProfileUseCase(
      this.database,
      this.encript,
      this.notifier,
      this.cache,
    );
    return await useCase.updateCredentials(userId, data);
  }

  public async verify(token: string) {
    const useCase = new VerifyAcountUseCase(
      this.database,
      this.emailService,
      this.jwt,
    );
    return await useCase.verify(token);
  }

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

  public async resetPassword(data: ResetPasswordDto) {
    const encriptPass = this.encript.encript(data.password);
    const useCase = new ResetPasswordUsecase(
      this.database,
      this.emailService,
      this.jwt,
    );
    return await useCase.rest(data.token, encriptPass);
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
