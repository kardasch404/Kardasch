import { Injectable } from '@nestjs/common';

export interface Metric {
  name: string;
  value: number;
  timestamp: Date;
  labels?: Record<string, string>;
}

@Injectable()
export class MetricsService {
  private metrics: Map<string, Metric[]> = new Map();
  private static instance: MetricsService;

  constructor() {
    if (MetricsService.instance) {
      return MetricsService.instance;
    }
    MetricsService.instance = this;
  }

  recordMetric(name: string, value: number, labels?: Record<string, string>): void {
    const metric: Metric = {
      name,
      value,
      timestamp: new Date(),
      labels,
    };

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push(metric);
    this.cleanOldMetrics(name);
  }

  incrementCounter(name: string, labels?: Record<string, string>): void {
    this.recordMetric(name, 1, labels);
  }

  recordDuration(name: string, durationMs: number, labels?: Record<string, string>): void {
    this.recordMetric(`${name}_duration_ms`, durationMs, labels);
  }

  getMetrics(name: string): Metric[] {
    return this.metrics.get(name) || [];
  }

  getAllMetrics(): Record<string, Metric[]> {
    const result: Record<string, Metric[]> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  private cleanOldMetrics(name: string): void {
    const metrics = this.metrics.get(name);
    if (!metrics) return;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const filtered = metrics.filter(m => m.timestamp > oneHourAgo);
    this.metrics.set(name, filtered);
  }
}
