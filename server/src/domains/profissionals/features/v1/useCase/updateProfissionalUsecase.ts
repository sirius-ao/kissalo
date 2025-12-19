import PrismaService from '@infra/database/prisma.service';
import { CreateProfessionalDto } from '../dto/create-profissional.dto';
import {
  UserAlreadyExistExecption,
  UserNotFoundExecption,
} from '@core/http/erros/user.error';
import { BadRequestException } from '@nestjs/common';

export class UpdateProfissionalUseCase {
  constructor(private readonly database: PrismaService) {}

  public async update(data: CreateProfessionalDto, id: number) {
    const [isAnUser, user] = await Promise.all([
      this.database.user.findFirst({
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
      }),
      this.database.user.findFirst({
        where: {
          id,
        },
      }),
    ]);
    if (isAnUser) {
      throw new UserAlreadyExistExecption();
    }
    if (!user) {
      throw new UserNotFoundExecption();
    }
    try {
      await Promise.all([
        this.database.user.update({
          data: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            avatarUrl: data.avatarUrl,
            phone: data.phone,
          },
          where: {
            id,
          },
        }),
        this.database.professional.update({
          data: {
            documentNumber: data.documentNumber,
            type: data.type,
            yearsExperience: data.yearsExperience,
            averageRating: 0,
            certifications: data.certification,
            contacts: data.contacts,
            cvUrl: data.cvUrl,
            coverUrl: data.coverUrl,
            specialties: data.specialties,
            title: data.title,
            socialMedia: JSON.stringify(data.socialMedia),
            portfolioUrl: data.portfolioUrl,
            description: data.description,
          },
          where: {
            userId: id,
          },
        }),
      ]);
    } catch (error) {
      throw new BadRequestException('Erro ao actualizar os seus dados');
    }
  }
}
