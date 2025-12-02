import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CaptchaService } from './captcha.service';

describe('CaptchaService', () => {
  let service: CaptchaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaptchaService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'RECAPTCHA_SECRET_KEY') return 'test-secret-key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CaptchaService>(CaptchaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should detect bot based on score', () => {
    expect(service.isBot(0.3)).toBe(true);
    expect(service.isBot(0.7)).toBe(false);
    expect(service.isBot(0.5)).toBe(false);
  });
});
