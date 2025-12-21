import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import PrismaModule from '@infra/database/prisma.module';
import CacheModule from '@infra/cache/cahe.module';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './domains/auth/auth.module';
import { ServicesModule } from './domains/services/services.module';
import { CategoriesModule } from './domains/categories/categories.module';
import { ReviewsModule } from './domains/reviews/reviews.module';
import { PaymentsModule } from './domains/payments/payments.module';
import { ProfissionalsModule } from './domains/profissionals/profissionals.module';
import { BookingsModule } from './domains/bookings/bookings.module';
import { WalletsModule } from './domains/wallets/wallets.module';
import { ConfigurationModule } from '@infra/config/config.module';
import { ClientsModule } from './domains/clients/clients.module';
import { UtilModule } from '@core/shared/utils/util.module';
import { IsAuthenticatedMiddlware } from '@core/http/middlewares/isAuthenticated.middleware';
import { BoostrapModule } from '@infra/boostrap/boostrap.module';
import { NotificationsModule } from './domains/notifications/notifications.module';
import { Shedule } from '@infra/schedule/schedule.module';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000,
          limit: 10,
        },
      ],
    }),
    Shedule,
    PrismaModule,
    CacheModule,
    AuthModule,
    ServicesModule,
    CategoriesModule,
    ReviewsModule,
    PaymentsModule,
    ProfissionalsModule,
    BookingsModule,
    WalletsModule,
    ConfigurationModule,
    ClientsModule,
    UtilModule,
    BoostrapModule,
    NotificationsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthenticatedMiddlware)
      .exclude(
        { path: 'v1/auth/login', method: RequestMethod.POST },
        { path: 'v1/profissionals', method: RequestMethod.POST },
        { path: 'v1/profissionals', method: RequestMethod.GET },
        { path: 'v1/auth/verify/:token', method: RequestMethod.PUT },
        { path: 'v1/auth/refresh/:token', method: RequestMethod.PUT },
        { path: 'v1/auth/recovery/:unique', method: RequestMethod.PATCH },
        { path: 'v1/auth/reset', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
