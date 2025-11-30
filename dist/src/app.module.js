"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./core/database/database.module");
const cache_module_1 = require("./core/cache/cache.module");
const health_module_1 = require("./core/health/health.module");
const graphql_module_1 = require("./core/graphql/graphql.module");
const observability_module_1 = require("./core/observability/observability.module");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const throttler_guard_1 = require("./common/guards/throttler.guard");
const validation_schema_1 = require("./config/validation.schema");
const app_config_1 = __importDefault(require("./config/app.config"));
const security_config_1 = __importDefault(require("./config/security.config"));
const observability_config_1 = __importDefault(require("./config/observability.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: validation_schema_1.validationSchema,
                load: [app_config_1.default, security_config_1.default, observability_config_1.default],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ([
                    {
                        ttl: configService.get('security.rateLimit.ttl', 60) * 1000,
                        limit: configService.get('security.rateLimit.limit', 100),
                    },
                ]),
                inject: [config_1.ConfigService],
            }),
            observability_module_1.ObservabilityModule,
            database_module_1.DatabaseModule,
            cache_module_1.CacheModule,
            graphql_module_1.GraphqlModule,
            health_module_1.HealthModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_guard_1.CustomThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map