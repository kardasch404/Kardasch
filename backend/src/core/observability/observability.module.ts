import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { AuditLoggerService } from './audit-logger.service';
import { LoggingModule } from '../../modules/logging/logging.module';

@Global()
@Module({
  imports: [LoggingModule],
  controllers: [MetricsController],
  providers: [LoggerService, MetricsService, AuditLoggerService],
  exports: [LoggerService, MetricsService, AuditLoggerService],
})
export class ObservabilityModule {}
