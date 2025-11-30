"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const operators_1 = require("rxjs/operators");
const logger_service_1 = require("../../core/observability/logger.service");
const metrics_service_1 = require("../../core/observability/metrics.service");
let LoggingInterceptor = class LoggingInterceptor {
    logger;
    metrics;
    constructor(logger, metrics) {
        this.logger = logger;
        this.metrics = metrics;
    }
    intercept(context, next) {
        const now = Date.now();
        const ctx = graphql_1.GqlExecutionContext.create(context);
        const info = ctx.getInfo();
        const request = ctx.getContext().req;
        const operationType = info?.operation?.operation || 'unknown';
        const fieldName = info?.fieldName || 'unknown';
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - now;
            this.logger.log(`${operationType} ${fieldName} completed in ${duration}ms`, 'GraphQL');
            this.metrics.recordDuration('graphql_operation', duration, {
                operation: operationType,
                field: fieldName,
            });
            this.metrics.incrementCounter('graphql_requests_total', {
                operation: operationType,
                status: 'success',
            });
        }), (0, operators_1.catchError)((error) => {
            const duration = Date.now() - now;
            this.logger.error(`${operationType} ${fieldName} failed after ${duration}ms`, error.stack, 'GraphQL');
            this.metrics.incrementCounter('graphql_requests_total', {
                operation: operationType,
                status: 'error',
            });
            throw error;
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        metrics_service_1.MetricsService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map