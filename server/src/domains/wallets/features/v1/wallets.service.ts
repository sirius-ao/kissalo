import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import PrismaService from '@infra/database/prisma.service';
import CacheService from '@infra/cache/cahe.service';
import { NotificationFactory } from '@core/shared/utils/services/Notification/notification.factory';
import { CreateWalletsFacede } from './facade/createWalletsUsecase';
import { GetWalletFacade } from './facade/getWalletsUsecase';
import { UpdateWalletFacede } from './facade/updateWalletUseCase';

@Injectable()
export class WalletsService {
  constructor(
    private readonly database: PrismaService,
    private readonly cache: CacheService,
    private readonly notifier: NotificationFactory,
  ) {}

  public async create(data: CreateWalletDto, userId: number) {
    const facede = new CreateWalletsFacede(
      this.database,
      this.cache,
      this.notifier,
    );
    return await facede.create(data, userId);
  }

  public async findAll(page: number, limit: number, userId: number) {
    const facede = new GetWalletFacade(this.database, this.cache);
    return await facede.get(userId, page, limit);
  }

  public async findOne(id: number, userId: number) {
    const facede = new GetWalletFacade(this.database, this.cache);
    return await facede.getDetails(id, userId);
  }

  public async update(id: number, data: CreateWalletDto, userId: number) {
    const facede = new UpdateWalletFacede(
      this.database,
      this.cache,
      this.notifier,
    );
    return await facede.update(data, id, userId);
  }

  public async toggle(id: number) {
    const facede = new UpdateWalletFacede(
      this.database,
      this.cache,
      this.notifier,
    );
    return await facede.toogleStatus(id);
  }
}
