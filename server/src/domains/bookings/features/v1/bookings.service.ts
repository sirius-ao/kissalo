import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  UpdateBookinSatatusProfisional,
  UpdateBookingDto,
} from './dto/update-booking.dto';
import PrismaService from '@infra/database/prisma.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { ServicesService } from '@domains/services/features/v1/services.service';
import { ClientsService } from '@domains/clients/clients.service';
import { CreateBookingUseFacade } from './useCases/createBookingUsecase';
import { Booking } from '@prisma/client';
import { ProfissionalToogleBookingStatus } from './useCases/profissionalToggleStatusUsecase';
import { ProfissionalsService } from '@domains/profissionals/features/v1/profissionals.service';
import { GetBookingFacede } from './useCases/getBookingUsacse';
import CacheService from '@infra/cache/cahe.service';
import { CancelBookingUseCase } from './useCases/cancelBookingUsecase';

@Injectable()
export class BookingsService {
  constructor(
    private readonly database: PrismaService,
    private readonly notification: NotificationFactory,
    private readonly services: ServicesService,
    private readonly clientService: ClientsService,
    private readonly profissionalService: ProfissionalsService,
    private readonly cache: CacheService,
  ) {}

  public async create(data: CreateBookingDto, userId: number) {
    const createFacade = new CreateBookingUseFacade(
      this.database,
      this.notification,
      this.services,
      this.clientService,
    );
    return await createFacade.create(data, userId);
  }

  public async toogle(data: UpdateBookinSatatusProfisional, userId: number) {
    data.userId = userId;
    const toogleFacade = new ProfissionalToogleBookingStatus(
      this.database,
      this.notification,
      this,
      this.profissionalService,
      this.clientService,
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

  public async cancel(
    bookingId: number,
    userId: number,
    data: UpdateBookinSatatusProfisional,
  ) {
    const facede = new CancelBookingUseCase(
      this.database,
      this.notification,
      this,
    );
    return await facede.cancel(bookingId, userId, data);
  }
}
