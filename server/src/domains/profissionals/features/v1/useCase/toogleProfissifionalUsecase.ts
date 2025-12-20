import { UserNotFoundExecption } from '@core/http/erros/user.error';
import PrismaService from '@infra/database/prisma.service';

export class ToogleProfissionalUseCase {
  constructor(private readonly database: PrismaService) {}

  public async toogle(id: number) {
    const profissional = await this.database.user.findFirst({
      where: {
        id,
        role: 'PROFESSIONAL',
      },
      include: {
        professional: true,
      },
    });
    if (profissional) {
      const newCurrentStatus =
        profissional.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await this.database.user.update({
        data: {
          status: newCurrentStatus,
          professional: {
            update: {
              isVerified: newCurrentStatus === 'ACTIVE',
              docs: {
                updateMany: {
                  data: {
                    status: 'APPROVED',
                  },
                  where: {
                    professionalId: profissional.professional.id,
                  },
                },
              },
            },
          },
        },
        where: {
          id,
        },
      });
      return {
        messsage: `Profissional actualizado para ${newCurrentStatus == 'ACTIVE' ? 'Activo' : 'Inactivo'}`,
      };
    }
    throw new UserNotFoundExecption()
  }
}
