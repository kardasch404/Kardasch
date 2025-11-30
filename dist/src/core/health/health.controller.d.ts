import { HealthService } from './health.service';
export declare class HealthController {
    private healthService;
    constructor(healthService: HealthService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
