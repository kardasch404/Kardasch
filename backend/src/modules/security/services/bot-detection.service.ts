import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

export interface BotDetectionResult {
  isBot: boolean;
  score: number;
  reasons: string[];
}

@Injectable()
export class BotDetectionService {
  private readonly suspiciousUAs = [
    'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 'python', 'java',
  ];

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async detect(request: any): Promise<BotDetectionResult> {
    const reasons: string[] = [];
    let score = 0;

    // Check User-Agent
    const uaScore = this.checkUserAgent(request.headers['user-agent']);
    if (uaScore > 0) {
      reasons.push('Suspicious User-Agent');
      score += uaScore;
    }

    // Check for missing common headers
    const headerScore = this.checkHeaders(request.headers);
    if (headerScore > 0) {
      reasons.push('Missing common headers');
      score += headerScore;
    }

    // Check honeypot field
    const honeypotScore = this.checkHoneypot(request.body);
    if (honeypotScore > 0) {
      reasons.push('Honeypot field filled');
      score += honeypotScore;
    }

    // Check request frequency
    const frequencyScore = await this.checkRequestFrequency(this.getClientIp(request));
    if (frequencyScore > 0) {
      reasons.push('Abnormal request frequency');
      score += frequencyScore;
    }

    // Check fingerprint consistency
    const fingerprintScore = await this.checkFingerprint(request);
    if (fingerprintScore > 0) {
      reasons.push('Inconsistent fingerprint');
      score += fingerprintScore;
    }

    const isBot = score >= 50; // Threshold for bot detection

    return { isBot, score, reasons };
  }

  private checkUserAgent(userAgent?: string): number {
    if (!userAgent) return 30;

    const ua = userAgent.toLowerCase();
    
    // Check for suspicious patterns
    for (const pattern of this.suspiciousUAs) {
      if (ua.includes(pattern)) {
        return 40;
      }
    }

    // Check for very short or very long UA
    if (ua.length < 20 || ua.length > 500) {
      return 20;
    }

    return 0;
  }

  private checkHeaders(headers: any): number {
    let score = 0;

    // Check for missing common browser headers
    if (!headers['accept-language']) score += 10;
    if (!headers['accept-encoding']) score += 10;
    if (!headers['accept']) score += 10;

    // Check for suspicious header combinations
    if (headers['user-agent'] && !headers['accept']) {
      score += 15;
    }

    return score;
  }

  private checkHoneypot(body: any): number {
    // Check for honeypot fields (fields that should be empty)
    const honeypotFields = ['website', 'url', 'homepage', 'phone_number'];
    
    for (const field of honeypotFields) {
      if (body && body[field]) {
        return 100; // Definite bot
      }
    }

    return 0;
  }

  private async checkRequestFrequency(ip: string): Promise<number> {
    const key = `bot-detection:freq:${ip}`;
    const count = await this.cacheManager.get<number>(key) || 0;

    // Increment counter
    await this.cacheManager.set(key, count + 1, 60); // 60 second window

    // More than 30 requests per minute is suspicious
    if (count > 30) return 30;
    if (count > 20) return 20;
    if (count > 10) return 10;

    return 0;
  }

  private async checkFingerprint(request: any): Promise<number> {
    const ip = this.getClientIp(request);
    const userAgent = request.headers['user-agent'];
    const acceptLanguage = request.headers['accept-language'];

    const fingerprint = `${ip}:${userAgent}:${acceptLanguage}`;
    const key = `bot-detection:fp:${ip}`;

    const storedFingerprint = await this.cacheManager.get<string>(key);

    if (storedFingerprint && storedFingerprint !== fingerprint) {
      // Fingerprint changed for same IP
      return 25;
    }

    // Store fingerprint for 1 hour
    await this.cacheManager.set(key, fingerprint, 3600);

    return 0;
  }

  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      'unknown'
    );
  }

  async recordBotActivity(ip: string, reason: string): Promise<void> {
    const key = `bot-detection:activity:${ip}`;
    const activities = await this.cacheManager.get<string[]>(key) || [];
    
    activities.push(`${new Date().toISOString()}: ${reason}`);
    
    // Keep last 10 activities
    if (activities.length > 10) {
      activities.shift();
    }

    await this.cacheManager.set(key, activities, 86400); // 24 hours
  }
}
