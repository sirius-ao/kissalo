import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreatePaymentUseCase } from './useCases/createPaymentUseCase';
import PrismaService from '@infra/database/prisma.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { BookingsService } from '@domains/bookings/features/v1/bookings.service';
import { GetPaymentUseCase } from './useCases/getPayentUseCase';
import { UpdatePaymentUseCase } from './useCases/updatePaymentUseCase';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: NotificationFactory,
    private readonly bookservice: BookingsService,
  ) {}

  public async create(createPaymentDto: CreatePaymentDto, userId: number) {
    const createPaymentFacede = new CreatePaymentUseCase(
      this.prisma,
      this.notifier,
      this.bookservice,
    );
    return await createPaymentFacede.execute(createPaymentDto, userId);
  }

  public async update(
    data: UpdatePaymentDto,
    userId: number,
    paymentId: number,
  ) {
    const updatePaymentFacede = new UpdatePaymentUseCase(
      this.prisma,
      this.notifier,
    );
    return await updatePaymentFacede.execute(paymentId, data, userId);
  }

  public async findAll(userId: number, page: number, limit: number) {
    const getUsecase = new GetPaymentUseCase(this.prisma);
    return await getUsecase.getAllMyPayments(userId, page, limit);
  }

  public async findOne(paymentId: number, userId: number) {
    const getUsecase = new GetPaymentUseCase(this.prisma);
    return await getUsecase.getOne(paymentId, userId);
  }
}
