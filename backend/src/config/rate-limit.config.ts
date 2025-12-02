import { registerAs } from '@nestjs/config';

export enum UserRole {
  ANONYMOUS = 'ANONYMOUS',
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface RateLimitTier {
  requestsPerMinute: number;
  graphqlCostLimit: number;
}

export const rateLimitTiers: Record<UserRole, RateLimitTier> = {
  [UserRole.ANONYMOUS]: {
    requestsPerMinute: 10,
    graphqlCostLimit: 100,
  },
  [UserRole.USER]: {
    requestsPerMinute: 100,
    graphqlCostLimit: 1000,
  },
  [UserRole.ADMIN]: {
    requestsPerMinute: 1000,
    graphqlCostLimit: 10000,
  },
};

export default registerAs('rateLimit', () => ({
  tiers: rateLimitTiers,
  windowMs: 60000, // 1 minute
  redisKeyPrefix: 'rate-limit:',
}));
