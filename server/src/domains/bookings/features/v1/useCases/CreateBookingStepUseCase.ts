import PrismaService from '@infra/database/prisma.service';
import CacheService from '@infra/cache/cahe.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { BookingWithRelations } from '@core/shared/types';
import { UpdateBookinSatatusProfisional } from '../dto/update-booking.dto';

export class CreateBookingStepUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async execute({
    bookingId,
    userId,
    notes,
    files,
  }: UpdateBookinSatatusProfisional) {
    const booking = await this.database.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        professional: true,
        service: true,
        steps: true,
      },
    });
    if (!booking) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    const isClient = booking.clientId === userId;
    const isProfessional = booking.professional?.userId === userId;

    if (!isClient && !isProfessional) {
      throw new ForbiddenException(
        'Você não tem permissão para adicionar etapas neste agendamento',
      );
    }
    await this.database.bookingSteps.create({
      data: {
        bookingId,
        senderId: userId,
        notes,
        files,
      },
    });

    const cacheKey = `booking-${bookingId}`;
    const updatedBooking: BookingWithRelations =
      await this.database.booking.findUnique({
        where: { id: bookingId },
        include: {
          client: true,
          professional: {
            include: {
              user: {
                omit: { password: true },
              },
            },
          },
          service: {
            include: { category: true },
          },
          steps: true,
          review: true,
        },
      });
    if (updatedBooking) {
      await this.cache.set(cacheKey, updatedBooking, 60 * 60);
    }
    return {
      data: updatedBooking,
      sucess: true,
    };
  }
}
