import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import axios from 'axios';
import * as crypto from 'crypto';

export interface PasswordStrength {
  score: number;
  feedback: string[];
}

@Injectable()
export class PasswordService {
  private readonly HIBP_API = 'https://api.pwnedpasswords.com/range/';

  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  }

  async verify(hash: string, password: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, password);
    } catch {
      return false;
    }
  }

  calculateStrength(password: string): PasswordStrength {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 20;
    else feedback.push('Password should be at least 8 characters');

    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    if (/[a-z]/.test(password)) score += 15;
    else feedback.push('Add lowercase letters');

    if (/[A-Z]/.test(password)) score += 15;
    else feedback.push('Add uppercase letters');

    if (/[0-9]/.test(password)) score += 15;
    else feedback.push('Add numbers');

    if (/[^a-zA-Z0-9]/.test(password)) score += 15;
    else feedback.push('Add special characters');

    if (!/(.)\1{2,}/.test(password)) score += 10;
    else feedback.push('Avoid repeated characters');

    return { score: Math.min(score, 100), feedback };
  }

  async isCompromised(password: string): Promise<boolean> {
    const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
      const response = await axios.get(`${this.HIBP_API}${prefix}`, {
        timeout: 5000,
      });

      const hashes = response.data.split('\n');
      return hashes.some((line: string) => line.startsWith(suffix));
    } catch {
      return false;
    }
  }
}
