import { Injectable } from '@nestjs/common';
import { IVerificationService } from './verification.interface';
import { User, VerificationsType } from '@prisma/client';
import { EmailServiceInterface } from '../EmailService/emailService.interface';
import { JwtService } from '@nestjs/jwt';
import PrismaService from '@infra/database/prisma.service';

@Injectable()
export class VerificationService implements IVerificationService {
  private readonly jwtService = new JwtService({
    secret: process.env.JWT_SECRET,
  });
  constructor(
    private readonly emailService: EmailServiceInterface,
    private readonly database: PrismaService,
  ) { }
  
  public async verify(token: string): Promise<void> {}

  public async create(user: User, type: VerificationsType): Promise<void> {
    const token = this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '5m',
      },
    );
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await Promise.all([
      this.database.verifications.upsert({
        create: {
          expiresAt,
          userId: user.id,
          type,
          token,
        },
        update: {
          isUsed: false,
          expiresAt,
          userId: user.id,
          type,
          token,
        },
        where: {
          userId: user.id,
        },
      }),
      this.emailService.send({
        to: user.email,
        subject: '',
        html: ``,
        text: '',
      }),
    ]);
  }
}
