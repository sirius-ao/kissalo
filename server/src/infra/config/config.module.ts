import { EnvSchema } from '@core/shared/schemas/env.schema';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate(config) {
        EnvSchema.parse(config);
        return config;
      },
    }),
  ],
})
export class ConfigurationModule {}
