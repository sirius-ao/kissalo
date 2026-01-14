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
import { AuthModule } from './domains/auth/auth.module';
import { ServicesModule } from './domains/services/services.module';
import { CategoriesModule } from './domains/categories/categories.module';
import { ReviewsModule } from './domains/reviews/reviews.module';
import { PaymentsModule } from './domains/payments/payments.module';
import { ProfissionalsModule } from './domains/users/profissionals.module';
import { BookingsModule } from './domains/bookings/bookings.module';
import { ConfigurationModule } from '@infra/config/config.module';
import { UtilModule } from '@core/shared/utils/util.module';
import { IsAuthenticatedMiddlware } from '@core/http/middlewares/isAuthenticated.middleware';
import { NotificationsModule } from './domains/notifications/notifications.module';
import { Shedule } from '@infra/schedule/schedule.module';
import { LlmsModule } from './domains/llms/llms.module';
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
    ConfigurationModule,
    UtilModule,
    NotificationsModule,
    LlmsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsAuthenticatedMiddlware)
      .exclude(
        { path: 'v1/auth/login', method: RequestMethod.POST },
        { path: 'v1/users', method: RequestMethod.POST },
        { path: 'v1/auth/:token/verify', method: RequestMethod.PUT },
        { path: 'v1/auth/:token/refresh', method: RequestMethod.PUT },
        { path: 'v1/auth/:unique/recovery', method: RequestMethod.PUT },
        { path: 'v1/auth/reset', method: RequestMethod.POST },
        { path: 'v1/services', method: RequestMethod.GET },
        { path: 'v1/services/:id', method: RequestMethod.GET },
        { path: 'v1/services/category/:categoryId', method: RequestMethod.GET },
        { path: 'v1/categories', method: RequestMethod.GET },
        { path: 'v1/categories/:id', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
