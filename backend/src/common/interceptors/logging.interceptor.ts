import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { LoggerService } from '../../core/observability/logger.service';
import { MetricsService } from '../../core/observability/metrics.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly metrics: MetricsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();
    const request = ctx.getContext().req;
    
    const operationType = info?.operation?.operation || 'unknown';
    const fieldName = info?.fieldName || 'unknown';
    
    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        this.logger.log(
          `${operationType} ${fieldName} completed in ${duration}ms`,
          'GraphQL',
        );
        this.metrics.recordDuration('graphql_operation', duration, {
          operation: operationType,
          field: fieldName,
        });
        this.metrics.incrementCounter('graphql_requests_total', {
          operation: operationType,
          status: 'success',
        });
      }),
      catchError((error) => {
        const duration = Date.now() - now;
        this.logger.error(
          `${operationType} ${fieldName} failed after ${duration}ms`,
          error.stack,
          'GraphQL',
        );
        this.metrics.incrementCounter('graphql_requests_total', {
          operation: operationType,
          status: 'error',
        });
        throw error;
      }),
    );
  }
}
