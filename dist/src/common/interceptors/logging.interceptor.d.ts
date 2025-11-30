import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../../core/observability/logger.service';
import { MetricsService } from '../../core/observability/metrics.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly logger;
    private readonly metrics;
    constructor(logger: LoggerService, metrics: MetricsService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
