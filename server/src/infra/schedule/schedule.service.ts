import PrismaService from '@infra/database/prisma.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduleService implements OnModuleInit {
  private readonly logger = new Logger(ScheduleService.name);
  constructor(private readonly database: PrismaService) {}
  @Cron(CronExpression.EVERY_HOUR)
  public async cancelAllEndingbooking() {
    const data = await this.database.booking.updateMany({
      where: {
        endTime: {
          lt: new Date(),
        },
        status: {
          notIn: ['CONFIRMED', 'STARTED', 'CANCELED', 'COMPLETED'],
        },
        payment: null,
        professionalId: null,
      },
      data: {
        status: 'CANCELED',
      },
    });
    this.logger.debug(`${data.count} Agendamentos Cancelados`);
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async removeIsFeature() {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const data = await this.database.serviceTemplate.updateMany({
      where: {
        isFeatured: true,
        createdAt: {
          lt: threeDaysAgo,
        },
      },
      data: {
        isFeatured: false,
      },
    });
    this.logger.debug(`${data.count} Serviços removidos como featured`);
  }
  onModuleInit() {
    this.logger.debug(`✅ Cron job iniciado`);
  }
}
