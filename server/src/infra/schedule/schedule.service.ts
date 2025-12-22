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
          gte: new Date(),
        },
        status: {
          notIn: ['ACEPTED', 'CONFIRMED', 'STARTED'],
        },
      },
      data: {
        status: 'CANCELED',
      },
    });
    this.logger.debug(`${data.count} Agendamentos Cancelados`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async removeIsFeature() {
    const treeDays = new Date();
    treeDays.setDate(treeDays.getDate() + 3);
    const data = await this.database.serviceTemplate.updateMany({
      where: {
        createdAt: {
          gte: treeDays,
        },
      },
      data: {
        isFeatured: false,
      },
    });
    this.logger.debug(`${data.count} Agendamentos Cancelados`);
  }
  onModuleInit() {
    this.logger.debug(`✅ Cron job iniciado`);
  }
}
