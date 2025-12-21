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
        steps: true,
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
  public async get(page: number, limit: number, userId: number) {
    page = isNaN(page) || page == 0 ? 1 : page;
    limit = isNaN(limit) || limit == 0 ? 10 : limit;
    const skip = (page - 1) * limit;
    const user = await this.database.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        professional: true,
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
    const res = await this.getByUser(skip, limit, page, where);
    return res;
  }
  private async getByUser(
    skip: number,
    take: number,
    page: number,
    where: any,
  ) {
    const [bookings, total] = await Promise.all([
      this.database.booking.findMany({
        take,
        skip,
        where,
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
          steps: true,
          review: true,
        },
      }),
      this.database.booking.count({
        where,
      }),
    ]);
    const totalPages = Math.ceil(total / take);
    return {
      data: bookings,
      pagination: {
        page,
        take,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        lastPage: totalPages,
      },
    };
  }
}
