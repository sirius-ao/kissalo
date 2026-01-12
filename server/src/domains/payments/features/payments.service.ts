import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreatePaymentUseCase } from './useCases/createPaymentUseCase';
import PrismaService from '@infra/database/prisma.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { BookingsService } from '@domains/bookings/features/v1/bookings.service';
import { GetPaymentUseCase } from './useCases/getPayentUseCase';
import { UpdatePaymentUseCase } from './useCases/updatePaymentUseCase';
import { CreateConciliationUsecase } from './useCases/createConciliationUsecase';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: NotificationFactory,
    private readonly bookservice: BookingsService,
  ) {}

  public async consolidate(
    paymentId: number,
    walleltId: number,
    fileUrl: string,
  ) {
    const consolidateFacede = new CreateConciliationUsecase(
      this.prisma,
      this.notifier,
    );
    return await consolidateFacede.create(paymentId, walleltId, fileUrl);
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

  public async findAll(userId: number) {
    const getUsecase = new GetPaymentUseCase(this.prisma);
    return await getUsecase.getAllMyPayments(userId);
  }

  public async findOne(paymentId: number, userId: number) {
    const getUsecase = new GetPaymentUseCase(this.prisma);
    return await getUsecase.getOne(paymentId, userId);
  }
}
