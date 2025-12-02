import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BruteForceService } from './brute-force.service';
import { LoggerService } from '../../../core/observability/logger.service';

describe('BruteForceService', () => {
  let service: BruteForceService;
  let cacheManager: any;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      del: jest.fn().mockResolvedValue(undefined),
    };

    const mockLogger = {
      warn: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BruteForceService,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<BruteForceService>(BruteForceService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should allow login when no previous attempts', async () => {
    await expect(service.checkAccountLock('test@example.com')).resolves.not.toThrow();
  });

  it('should block login when account is locked', async () => {
    cacheManager.get.mockResolvedValue({
      count: 5,
      lastAttempt: Date.now(),
      lockedUntil: Date.now() + 1800000,
    });

    await expect(service.checkAccountLock('test@example.com')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should apply progressive delay after failed attempts', async () => {
    cacheManager.get.mockResolvedValue({
      count: 2,
      lastAttempt: Date.now() - 1000, // 1 second ago
    });

    // Should throw because delay is 2^2 = 4 seconds
    await expect(service.checkAccountLock('test@example.com')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should ban IP after 10 failed attempts', async () => {
    cacheManager.get.mockResolvedValue({
      count: 10,
      lastAttempt: Date.now(),
      lockedUntil: Date.now() + 86400000,
    });

    await expect(service.checkIpBan('192.168.1.1')).rejects.toThrow(UnauthorizedException);
  });

  it('should reset attempts on successful login', async () => {
    await service.recordSuccessfulLogin('test@example.com', '192.168.1.1');

    expect(cacheManager.del).toHaveBeenCalledWith('brute-force:account:test@example.com');
    expect(cacheManager.del).toHaveBeenCalledWith('brute-force:ip:192.168.1.1');
  });
});
