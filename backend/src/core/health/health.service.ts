import { Injectable } from '@nestjs/common';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';
import { DatabaseService } from '../database/database.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
    private databaseService: DatabaseService,
    private cacheService: CacheService,
  ) {}

  async check() {
    return this.health.check([
      () => this.db.pingCheck('mongodb'),
      async () => ({
        redis: {
          status: (await this.cacheService.check()) ? 'up' : 'down',
        },
      }),
    ]);
  }
}
