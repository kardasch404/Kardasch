import { registerAs } from '@nestjs/config';

export default registerAs('thirdParty', () => ({
  deepl: {
    apiKey: process.env.DEEPL_API_KEY,
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kardasch',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
}));
