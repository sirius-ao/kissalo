import { Injectable } from '@nestjs/common';
import { CreateBookingDto, CreateStepsDto } from './dto/create-booking.dto';
import { UpdateBookinStatus, UpdateBookingDto } from './dto/update-booking.dto';
import PrismaService from '@infra/database/prisma.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { ServicesService } from '@domains/services/features/v1/services.service';
import { CreateBookingUseFacade } from './useCases/createBookingUsecase';
import { Booking } from '@prisma/client';
import { ToogleBookingUseCase } from './useCases/toggleStatusUsecase';
import { ProfissionalsService } from '@domains/users/features/v1/profissionals.service';
import { GetBookingFacede } from './useCases/getBookingUsacse';
import CacheService from '@infra/cache/cahe.service';
import { CreateBookingStepUseCase } from './useCases/CreateBookingStepUseCase';
import { LiberateBookingUseCase } from './useCases/liberateBookingusecase';

@Injectable()
export class BookingsService {
  constructor(
    private readonly database: PrismaService,
    private readonly notification: NotificationFactory,
    private readonly services: ServicesService,
    private readonly profissionalService: ProfissionalsService,
    private readonly cache: CacheService,
  ) {}

  public async create(data: CreateBookingDto, userId: number) {
    const createFacade = new CreateBookingUseFacade(
      this.database,
      this.notification,
      this.services,
    );
    return await createFacade.create(data, userId);
  }

  public async createSteps(
    data: CreateStepsDto,
    userId: number,
    bookingId: number,
  ) {
    const createFacade = new CreateBookingStepUseCase(
      this.database,
      this.cache,
    );

    return await createFacade.execute(data, userId, bookingId);
  }

  public async liberate(bookingId: number, userId: number) {
    const liberateFacede = new LiberateBookingUseCase(
      this.database,
      this.notification,
    );
    return await liberateFacede.liberate(bookingId, userId);
  }
  public async toogle(
    data: UpdateBookinStatus,
    userId: number,
    bookingId: number,
  ) {
    const toogleFacade = new ToogleBookingUseCase(
      this.database,
      this.notification,
    );
    return await toogleFacade.toogle(data, userId, bookingId);
  }
  public async findAll(page: number, limit: number, userId: number) {
    const getBookingFacede = new GetBookingFacede(this.database, this.cache);
    return await getBookingFacede.get(page, limit, userId);
  }
  async findOne(id: number) {
    const getBookingFacede = new GetBookingFacede(this.database, this.cache);
    return await getBookingFacede.getOne(id);
  }
}
