import { EmailServiceInterface } from "@core/shared/utils/services/EmailService/emailService.interface";
import PrismaService from "@infra/database/prisma.service";
import { JwtService } from "@nestjs/jwt";


export class VerifyAcountUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly emailService: EmailServiceInterface,
    private readonly jwt: JwtService,
  ) { }
  
  public async verify(token: string) {
    
  }
}