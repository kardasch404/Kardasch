import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { CacheModule } from './core/cache/cache.module';
import { HealthModule } from './core/health/health.module';
import { GraphqlModule } from './core/graphql/graphql.module';
import { ObservabilityModule } from './core/observability/observability.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';
import { validationSchema } from './config/validation.schema';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProjectModule } from './modules/project/project.module';
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
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ([
        {
          ttl: configService.get('security.rateLimit.ttl', 60) * 1000,
          limit: configService.get('security.rateLimit.limit', 100),
        },
      ]),
      inject: [ConfigService],
    }),
    ObservabilityModule,
    DatabaseModule,
    CacheModule,
    GraphqlModule,
    HealthModule,
    UserModule,
    AuthModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
