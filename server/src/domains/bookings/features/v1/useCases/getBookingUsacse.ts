import { UserNotFoundExecption } from '@core/http/erros/user.error';
import { BookingWithRelations } from '@core/shared/types';
import CacheService from '@infra/cache/cahe.service';
import PrismaService from '@infra/database/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class GetBookingFacede {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
  ) {}

  public async getOne(id: number): Promise<BookingWithRelations> {
    const cachedBooking = await this.cache.get<BookingWithRelations>(
      `booking-${id}`,
    );
    if (cachedBooking) {
      return cachedBooking;
    }
    const booking = await this.database.booking.findUnique({
      where: {
        id,
      },
      include: {
        client: true,
        professional: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
        service: {
          include: {
            category: true,
          },
        },
        steps: {
          include: {
            user: {
              omit: {
                password: true,
              },
            },
          },
        },
        review: true,
        payment: true,
      },
    });
    if (booking) {
      await this.cache.set(`booking-${id}`, booking, 60 * 60);
      return booking;
    }
    throw new NotFoundException('Agendamento de serviço não encontrado');
  }
  public async get(userId: number) {
    const user = await this.database.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        professional: true,
      },
      omit: {
        password: true,
      },
    });
    if (!user) {
      throw new UserNotFoundExecption();
    }
    let where: Prisma.BookingWhereInput = {};
    switch (user.role) {
      case 'ADMIN':
        where = {};
        break;
      case 'CUSTOMER':
        where = {
          clientId: user.id,
        };
        break;
      case 'PROFESSIONAL':
        if (!user.professional) {
          throw new BadRequestException('Perfil profissional não encontrado');
        }
        where = { professionalId: user.professional.id };
        break;
      default:
        throw new BadRequestException('Tipo de usuário não suportado');
        break;
    }
    const [myBookings] = await Promise.all([this.getByUser(where)]);
    return {
      user,
      myBookings,
    };
  }
  private async getByUser(where: any) {
    const [bookings] = await Promise.all([
      this.database.booking.findMany({
        where,
        include: {
          client: {
            omit: {
              password: true,
            },
          },
          service: {
            include: {
              category: true,
            },
          },
          steps: true,
          review: true,
        },
      }),
    ]);
    return {
      data: bookings,
    };
  }
}
