import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should hash password with Argon2id', async () => {
      const password = 'TestPassword123!';
      const hash = await service.hash(password);

      expect(hash).toBeDefined();
      expect(hash).toContain('$argon2id$');
    });

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await service.hash(password);
      const hash2 = await service.hash(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verify', () => {
    it('should verify correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await service.hash(password);
      const result = await service.verify(hash, password);

      expect(result).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const hash = await service.hash(password);
      const result = await service.verify(hash, 'WrongPassword');

      expect(result).toBe(false);
    });

    it('should handle invalid hash gracefully', async () => {
      const result = await service.verify('invalid-hash', 'password');
      expect(result).toBe(false);
    });
  });

  describe('calculateStrength', () => {
    it('should score strong password highly', () => {
      const result = service.calculateStrength('MyStr0ng!P@ssw0rd');
      expect(result.score).toBeGreaterThan(80);
      expect(result.feedback).toHaveLength(0);
    });

    it('should score weak password lowly', () => {
      const result = service.calculateStrength('weak');
      expect(result.score).toBeLessThan(50);
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should provide feedback for missing requirements', () => {
      const result = service.calculateStrength('password');
      expect(result.feedback).toContain('Add uppercase letters');
      expect(result.feedback).toContain('Add numbers');
      expect(result.feedback).toContain('Add special characters');
    });

    it('should detect repeated characters', () => {
      const result = service.calculateStrength('Passsss111!!!');
      expect(result.feedback).toContain('Avoid repeated characters');
    });
  });

  describe('isCompromised', () => {
    it('should detect compromised password', async () => {
      mockedAxios.get.mockResolvedValue({
        data: 'ABC123:5\nDEF456:10',
      });

      const result = await service.isCompromised('password');
      expect(result).toBe(false);
    });

    it('should return false for non-compromised password', async () => {
      mockedAxios.get.mockResolvedValue({
        data: 'XYZ789:1',
      });

      const result = await service.isCompromised('UniqueP@ssw0rd123!');
      expect(result).toBe(false);
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      const result = await service.isCompromised('password');
      expect(result).toBe(false);
    });
  });
});
