import { Controller, Get } from '@nestjs/common';
import { MetricsService, Metric } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private metricsService: MetricsService) {}

  @Get()
  getMetrics(): Record<string, Metric[]> {
    return this.metricsService.getAllMetrics();
  }
}
