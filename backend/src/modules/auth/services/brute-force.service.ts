import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { LoggerService } from '../../../core/observability/logger.service';
import { AuditLoggerService } from '../../../core/observability/audit-logger.service';
import { AuditAction } from '../../../modules/logging/entities/audit-log.entity';

export interface BruteForceAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

@Injectable()
export class BruteForceService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly ACCOUNT_LOCK_DURATION = 1800; // 30 minutes
  private readonly IP_MAX_ATTEMPTS = 10;
  private readonly IP_BAN_DURATION = 86400; // 24 hours

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private logger: LoggerService,
    private auditLogger: AuditLoggerService,
  ) {}

  async recordFailedAttempt(identifier: string, ip: string): Promise<void> {
    await this.recordAccountAttempt(identifier);
    await this.recordIpAttempt(ip);
  }

  async recordSuccessfulLogin(identifier: string, ip: string): Promise<void> {
    await this.resetAccountAttempts(identifier);
    await this.resetIpAttempts(ip);
  }

  async checkAccountLock(identifier: string): Promise<void> {
    const key = `brute-force:account:${identifier}`;
    const attempt = await this.cacheManager.get<BruteForceAttempt>(key);

    if (!attempt) return;

    // Check if account is locked
    if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
      const remainingSeconds = Math.ceil((attempt.lockedUntil - Date.now()) / 1000);
      throw new UnauthorizedException(
        `Account locked due to too many failed attempts. Try again in ${remainingSeconds} seconds.`,
      );
    }

    // Check if progressive delay is needed
    if (attempt.count > 0 && attempt.count < this.MAX_ATTEMPTS) {
      const delay = this.calculateDelay(attempt.count);
      const timeSinceLastAttempt = Date.now() - attempt.lastAttempt;

      if (timeSinceLastAttempt < delay) {
        const remainingSeconds = Math.ceil((delay - timeSinceLastAttempt) / 1000);
        throw new UnauthorizedException(
          `Too many failed attempts. Please wait ${remainingSeconds} seconds before trying again.`,
        );
      }
    }
  }

  async checkIpBan(ip: string): Promise<void> {
    const key = `brute-force:ip:${ip}`;
    const attempt = await this.cacheManager.get<BruteForceAttempt>(key);

    if (!attempt) return;

    if (attempt.lockedUntil && Date.now() < attempt.lockedUntil) {
      const remainingHours = Math.ceil((attempt.lockedUntil - Date.now()) / 3600000);
      this.logger.warn(`IP banned: ${ip}`, 'BruteForceService');
      throw new UnauthorizedException(
        `IP address banned due to excessive failed attempts. Try again in ${remainingHours} hours.`,
      );
    }
  }

  private async recordAccountAttempt(identifier: string): Promise<void> {
    const key = `brute-force:account:${identifier}`;
    const attempt = await this.cacheManager.get<BruteForceAttempt>(key) || {
      count: 0,
      lastAttempt: Date.now(),
    };

    attempt.count += 1;
    attempt.lastAttempt = Date.now();

    // Lock account after MAX_ATTEMPTS
    if (attempt.count >= this.MAX_ATTEMPTS) {
      attempt.lockedUntil = Date.now() + this.ACCOUNT_LOCK_DURATION * 1000;
      this.logger.warn(
        `Account locked: ${identifier} after ${attempt.count} failed attempts`,
        'BruteForceService',
      );
      await this.auditLogger.logSecurityEvent(AuditAction.ACCOUNT_LOCKED, {
        username: identifier,
        ip: 'system',
        message: `Account locked after ${attempt.count} failed attempts`,
      });
    }

    await this.cacheManager.set(key, attempt, this.ACCOUNT_LOCK_DURATION);
  }

  private async recordIpAttempt(ip: string): Promise<void> {
    const key = `brute-force:ip:${ip}`;
    const attempt = await this.cacheManager.get<BruteForceAttempt>(key) || {
      count: 0,
      lastAttempt: Date.now(),
    };

    attempt.count += 1;
    attempt.lastAttempt = Date.now();

    // Ban IP after IP_MAX_ATTEMPTS
    if (attempt.count >= this.IP_MAX_ATTEMPTS) {
      attempt.lockedUntil = Date.now() + this.IP_BAN_DURATION * 1000;
      this.logger.error(
        `IP banned: ${ip} after ${attempt.count} failed attempts`,
        undefined,
        'BruteForceService',
      );
      await this.auditLogger.logSecurityEvent(AuditAction.IP_BANNED, {
        ip,
        message: `IP banned after ${attempt.count} failed attempts`,
      });
    }

    await this.cacheManager.set(key, attempt, this.IP_BAN_DURATION);
  }

  private async resetAccountAttempts(identifier: string): Promise<void> {
    const key = `brute-force:account:${identifier}`;
    await this.cacheManager.del(key);
  }

  private async resetIpAttempts(ip: string): Promise<void> {
    const key = `brute-force:ip:${ip}`;
    await this.cacheManager.del(key);
  }

  private calculateDelay(attemptCount: number): number {
    // Exponential backoff: 2^n seconds (in milliseconds)
    return Math.pow(2, attemptCount) * 1000;
  }

  async getAccountAttempts(identifier: string): Promise<BruteForceAttempt | null> {
    const key = `brute-force:account:${identifier}`;
    const result = await this.cacheManager.get<BruteForceAttempt>(key);
    return result ?? null;
  }

  async getIpAttempts(ip: string): Promise<BruteForceAttempt | null> {
    const key = `brute-force:ip:${ip}`;
    const result = await this.cacheManager.get<BruteForceAttempt>(key);
    return result ?? null;
  }
}
