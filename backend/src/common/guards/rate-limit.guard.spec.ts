import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { RateLimitGuard } from './rate-limit.guard';
import { UserRole } from '../../config/rate-limit.config';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let cacheManager: any;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn().mockResolvedValue(0),
      set: jest.fn().mockResolvedValue(undefined),
    };

    const mockConfigService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        if (key === 'rateLimit.windowMs') return 60000;
        if (key === 'rateLimit.redisKeyPrefix') return 'rate-limit:';
        if (key === 'rateLimit.tiers') {
          return {
            [UserRole.ANONYMOUS]: { requestsPerMinute: 10, graphqlCostLimit: 100 },
            [UserRole.USER]: { requestsPerMinute: 100, graphqlCostLimit: 1000 },
            [UserRole.ADMIN]: { requestsPerMinute: 1000, graphqlCostLimit: 10000 },
          };
        }
        return defaultValue;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitGuard,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn().mockReturnValue(false) } },
      ],
    }).compile();

    guard = module.get<RateLimitGuard>(RateLimitGuard);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow request within rate limit', async () => {
    const mockContext = createMockContext();
    const result = await guard.canActivate(mockContext);
    expect(result).toBe(true);
  });

  it('should block request exceeding rate limit', async () => {
    cacheManager.get.mockResolvedValue(10); // Already at limit
    const mockContext = createMockContext();

    await expect(guard.canActivate(mockContext)).rejects.toThrow(HttpException);
  });
});

function createMockContext(): ExecutionContext {
  const mockRequest = {
    ip: '127.0.0.1',
    headers: {
      'x-forwarded-for': '127.0.0.1',
    },
    user: undefined,
  };

  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: jest.fn().mockReturnValue([null, null, { req: mockRequest }, null]),
    getArgByIndex: jest.fn((index: number) => {
      const args = [null, null, { req: mockRequest }, null];
      return args[index];
    }),
    switchToRpc: jest.fn(),
    switchToHttp: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn().mockReturnValue('graphql'),
  } as any;
}
