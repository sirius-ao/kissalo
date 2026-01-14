import PrismaService from '@infra/database/prisma.service';
import { UpdateProfessionalDto } from '../dto/create-profissional.dto';
import { BadRequestException } from '@nestjs/common';
import { ProfissionalNotFoundExecption } from '@core/http/erros/profissional.error';

export class UpdateProfissionalUseCase {
  constructor(private readonly database: PrismaService) {}

  public async update(data: UpdateProfessionalDto, id: number) {
    const user = await this.database.user.findFirst({
      where: {
        id,
        role: 'PROFESSIONAL',
      },
      include: {
        professional: true,
      },
    });

    if (!user || !user?.professional) {
      throw new ProfissionalNotFoundExecption('');
    }

    try {
      await Promise.all([
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
      return {
        sucess: true,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao actualizar os seus dados');
    }
  }
}
