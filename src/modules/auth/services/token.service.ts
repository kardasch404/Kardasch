import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { RefreshToken } from '../entities/refresh-token.entity';
import { CacheService } from '../../../core/cache/cache.service';

export interface TokenPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    @InjectModel(RefreshToken.name) private readonly refreshTokenModel: Model<RefreshToken>,
  ) {}

  async generateTokenPair(userId: string, email: string, deviceFingerprint: string): Promise<TokenPair> {
    const accessToken = await this.generateAccessToken(userId, email);
    const refreshToken = await this.generateRefreshToken(userId, email, deviceFingerprint);
    return { accessToken, refreshToken };
  }

  private async generateAccessToken(userId: string, email: string): Promise<string> {
    const payload: TokenPayload = { sub: userId, email, type: 'access' };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '15m',
    });
  }

  private async generateRefreshToken(userId: string, email: string, deviceFingerprint: string): Promise<string> {
    const payload: TokenPayload = { sub: userId, email, type: 'refresh' };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.refreshTokenModel.create({
      userId,
      token: this.hashToken(token),
      deviceFingerprint,
      expiresAt,
    });

    return token;
  }

  async rotateRefreshToken(oldToken: string, deviceFingerprint: string): Promise<TokenPair> {
    const payload = await this.verifyRefreshToken(oldToken);
    const hashedToken = this.hashToken(oldToken);

    const storedToken = await this.refreshTokenModel.findOne({
      token: hashedToken,
      revoked: false,
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.deviceFingerprint !== deviceFingerprint) {
      throw new UnauthorizedException('Device mismatch');
    }

    await this.revokeRefreshToken(oldToken);
    return this.generateTokenPair(payload.sub, payload.email, deviceFingerprint);
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    const isBlacklisted = await this.cacheService.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token revoked');
    }

    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
  }

  async revokeRefreshToken(token: string): Promise<void> {
    const hashedToken = this.hashToken(token);
    await this.refreshTokenModel.updateOne(
      { token: hashedToken },
      { revoked: true, revokedAt: new Date() },
    );
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenModel.updateMany(
      { userId, revoked: false },
      { revoked: true, revokedAt: new Date() },
    );
  }

  async blacklistAccessToken(token: string): Promise<void> {
    await this.cacheService.set(`blacklist:${token}`, 'true', 900);
  }

  generateDeviceFingerprint(userAgent: string, ip: string): string {
    return crypto.createHash('sha256').update(`${userAgent}:${ip}`).digest('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
