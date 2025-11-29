import { registerAs } from '@nestjs/config';

export default registerAs('observability', () => ({
  apm: {
    enabled: process.env.APM_ENABLED === 'true',
    serviceName: process.env.APM_SERVICE_NAME || 'backend',
    serverUrl: process.env.APM_SERVER_URL,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
  },
  metrics: {
    enabled: process.env.METRICS_ENABLED === 'true',
    port: parseInt(process.env.METRICS_PORT || '9090', 10),
  },
}));
