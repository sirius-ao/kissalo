import { Module } from '@nestjs/common';
import PrismaModule from '@infra/database/prisma.module';
import CacheModule from '@infra/cache/cahe.module';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { EnvSchema } from '@core/shared/schemas/env.schema';
import { AuthModule } from './domains/auth/auth.module';
import { ServicesModule } from './domains/services/services.module';
import { CategoriesModule } from './domains/categories/categories.module';
import { ReviewsModule } from './domains/reviews/reviews.module';
import { PaymentsModule } from './domains/payments/payments.module';
import { CostumersModule } from './domains/costumers/costumers.module';
import { ProfissionalsModule } from './domains/profissionals/profissionals.module';
import { BookingsModule } from './domains/bookings/bookings.module';
import { WalletsModule } from './domains/wallets/wallets.module';
import { ExecutionModule } from './domains/execution/execution.module';
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
    ScheduleModule.forRoot({}),
    ConfigModule.forRoot({
      isGlobal: true,
      validate(config) {
        try {
          EnvSchema.parse(config);
        } catch (error) {}
        return config;
      },
    }),
    PrismaModule,
    CacheModule,
    AuthModule,
    ServicesModule,
    CategoriesModule,
    ReviewsModule,
    PaymentsModule,
    CostumersModule,
    ProfissionalsModule,
    BookingsModule,
    WalletsModule,
    ExecutionModule,
  ],
})
export class AppModule {}
