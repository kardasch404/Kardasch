import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: string, context?: string) {
    console.log(JSON.stringify({ level: 'info', message, context, timestamp: new Date() }));
  }

  error(message: string, trace?: string, context?: string) {
    console.error(JSON.stringify({ level: 'error', message, trace, context, timestamp: new Date() }));
  }

  warn(message: string, context?: string) {
    console.warn(JSON.stringify({ level: 'warn', message, context, timestamp: new Date() }));
  }

  debug(message: string, context?: string) {
    console.debug(JSON.stringify({ level: 'debug', message, context, timestamp: new Date() }));
  }

  verbose(message: string, context?: string) {
    console.log(JSON.stringify({ level: 'verbose', message, context, timestamp: new Date() }));
  }
}
