import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { CacheModule } from './core/cache/cache.module';
import { HealthModule } from './core/health/health.module';
import { GraphqlModule } from './core/graphql/graphql.module';
import { ObservabilityModule } from './core/observability/observability.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { validationSchema } from './config/validation.schema';
import appConfig from './config/app.config';
import securityConfig from './config/security.config';
import observabilityConfig from './config/observability.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [appConfig, securityConfig, observabilityConfig],
    }),
    ObservabilityModule,
    DatabaseModule,
    CacheModule,
    GraphqlModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
