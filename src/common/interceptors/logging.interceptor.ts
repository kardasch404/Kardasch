import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const ctx = GqlExecutionContext.create(context);
    const info = ctx.getInfo();
    
    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        this.logger.log(`${info?.fieldName} executed in ${delay}ms`);
      }),
    );
  }
}
