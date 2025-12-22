import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  UpdateBookinSatatusProfisional,
  UpdateBookingDto,
} from './dto/update-booking.dto';
import PrismaService from '@infra/database/prisma.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { ServicesService } from '@domains/services/features/v1/services.service';
import { ClientsService } from '@domains/clients/features/v1/clients.service';
import { CreateBookingUseFacade } from './useCases/createBookingUsecase';
import { Booking } from '@prisma/client';
import { ProfissionalToogleBookingStatus } from './useCases/profissionalToggleStatusUsecase';
import { ProfissionalsService } from '@domains/profissionals/features/v1/profissionals.service';
import { GetBookingFacede } from './useCases/getBookingUsacse';
import CacheService from '@infra/cache/cahe.service';
import { CancelBookingUseCase } from './useCases/cancelBookingUsecase';
import { StartBookingUseCase } from './useCases/startBookingUsecase';
import { CreateBookingStepUseCase } from './useCases/CreateBookingStepUseCase';
import { EndBookingUseCase } from './useCases/endBookingUsecase';
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
    data: UpdateBookinSatatusProfisional,
    userId: number,
  ) {
    const createFacade = new CreateBookingStepUseCase(
      this.database,
      this.cache,
    );

    data.userId = userId;
    return await createFacade.execute(data);
  }

  public async start(bookingId: number, userId: number) {
    const startFacede = new StartBookingUseCase(
      this.database,
      this.notification,
    );
    return await startFacede.execute(bookingId, userId);
  }

  public async end(bookingId: number, userId: number) {
    const endFacede = new EndBookingUseCase(this.database, this.notification);
    return await endFacede.execute(bookingId, userId);
  }

  public async liberate(bookingId: number, userId: number) {
    const liberateFacede = new LiberateBookingUseCase(
      this.database,
      this.notification,
    );
    return await liberateFacede.liberate(bookingId, userId);
  }
  public async toogle(data: UpdateBookinSatatusProfisional, userId: number) {
    data.userId = userId;
    const toogleFacade = new ProfissionalToogleBookingStatus(
      this.database,
      this.notification,
      this,
      this.profissionalService,
      this.services,
    );
    return await toogleFacade.toogle(data);
  }
  public async findAll(page: number, limit: number, userId: number) {
    const getBookingFacede = new GetBookingFacede(this.database, this.cache);
    return await getBookingFacede.get(page, limit, userId);
  }
  async findOne(id: number) {
    const getBookingFacede = new GetBookingFacede(this.database, this.cache);
    return await getBookingFacede.getOne(id);
  }
  public async cancel(userId: number, data: UpdateBookinSatatusProfisional) {
    const facede = new CancelBookingUseCase(
      this.database,
      this.notification,
      this,
    );

    data.userId = userId;
    return await facede.cancel(data);
  }
}
