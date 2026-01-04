import PrismaService from '@infra/database/prisma.service';
import CacheService from '@infra/cache/cahe.service';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BookingWithRelations } from '@core/shared/types';
import { ProfissionalNotFoundExecption } from '@core/http/erros/profissional.error';
import { CreateStepsDto } from '../dto/create-booking.dto';

export class CreateBookingStepUseCase {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
  ) {}

  async execute(
    { notes, files }: CreateStepsDto,
    userId: number,
    bookingId: number,
  ) {
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
    if (booking.status == 'CANCELED' || booking.status == 'REJECTED') {
      throw new ForbiddenException('Agendamento cancelado');
    }

    if (booking.status == 'PENDING') {
      throw new BadRequestException('Aguarde a aceitação');
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
          payment: true,
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
