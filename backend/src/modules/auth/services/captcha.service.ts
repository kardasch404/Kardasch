import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface CaptchaVerificationResult {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
}

@Injectable()
export class CaptchaService {
  private readonly secretKey: string;
  private readonly verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
  private readonly scoreThreshold = 0.5;

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('RECAPTCHA_SECRET_KEY', '');
  }

  async verify(token: string, remoteIp?: string): Promise<CaptchaVerificationResult> {
    if (!this.secretKey) {
      throw new BadRequestException('reCAPTCHA not configured');
    }

    try {
      const response = await axios.post(this.verifyUrl, null, {
        params: {
          secret: this.secretKey,
          response: token,
          remoteip: remoteIp,
        },
      });

      const result = response.data;

      if (!result.success) {
        throw new BadRequestException('CAPTCHA verification failed');
      }

      return result;
    } catch (error) {
      throw new BadRequestException('CAPTCHA verification error');
    }
  }

  async verifyWithScore(token: string, remoteIp?: string, action?: string): Promise<boolean> {
    const result = await this.verify(token, remoteIp);

    // Check score threshold
    if (result.score < this.scoreThreshold) {
      return false;
    }

    // Verify action if provided
    if (action && result.action !== action) {
      return false;
    }

    return true;
  }

  isBot(score: number): boolean {
    return score < this.scoreThreshold;
  }
}
