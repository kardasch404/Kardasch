import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { CacheModule } from './core/cache/cache.module';
import { HealthModule } from './core/health/health.module';
import { GraphqlModule } from './core/graphql/graphql.module';
import { validationSchema } from './config/validation.schema';
import appConfig from './config/app.config';
import securityConfig from './config/security.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [appConfig, securityConfig],
    }),
    DatabaseModule,
    CacheModule,
    GraphqlModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
