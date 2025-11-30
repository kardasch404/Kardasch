import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';

@Global()
@Module({
  controllers: [MetricsController],
  providers: [LoggerService, MetricsService],
  exports: [LoggerService, MetricsService],
})
export class ObservabilityModule {}
