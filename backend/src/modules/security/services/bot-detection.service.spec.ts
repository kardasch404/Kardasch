import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BotDetectionService } from './bot-detection.service';

describe('BotDetectionService', () => {
  let service: BotDetectionService;
  let cacheManager: any;

  beforeEach(async () => {
    const mockCacheManager = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotDetectionService,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<BotDetectionService>(BotDetectionService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should detect bot from suspicious user agent', async () => {
    const request = {
      headers: { 'user-agent': 'python-requests/2.28.0' },
      body: {},
      connection: { remoteAddress: '127.0.0.1' },
    };

    const result = await service.detect(request);
    expect(result.score).toBeGreaterThan(0);
    expect(result.reasons).toContain('Suspicious User-Agent');
  });

  it('should detect bot from honeypot field', async () => {
    const request = {
      headers: { 'user-agent': 'Mozilla/5.0' },
      body: { website: 'http://spam.com' },
      connection: { remoteAddress: '127.0.0.1' },
    };

    const result = await service.detect(request);
    expect(result.isBot).toBe(true);
    expect(result.reasons).toContain('Honeypot field filled');
  });

  it('should not detect legitimate browser', async () => {
    const request = {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'accept': 'text/html',
        'accept-language': 'en-US',
        'accept-encoding': 'gzip, deflate',
      },
      body: {},
      connection: { remoteAddress: '127.0.0.1' },
    };

    const result = await service.detect(request);
    expect(result.isBot).toBe(false);
  });
});
