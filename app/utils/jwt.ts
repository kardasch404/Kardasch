import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import config from '../config/config.js';

interface TokenPayload {
    userId: string;
    role?: string;
}

class JWTUtil {
    static generateAccessToken(userId: string, role: string): string {
        return jwt.sign(
            { userId, role },
            config.jwtAccessSecret,
            { expiresIn: config.jwtAccessExpiry } as SignOptions
        );
    }

    static generateRefreshToken(userId: string): string {
        return jwt.sign(
            { userId },
            config.jwtRefreshSecret,
            { expiresIn: config.jwtRefreshExpiry } as SignOptions
        );
    }

    static verifyAccessToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, config.jwtAccessSecret) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid or expired access token');
        }
    }

    static verifyRefreshToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
        } catch (error) {
            throw new Error('Invalid or expired refresh token');
        }
    }

    static decodeToken(token: string): TokenPayload | null {
        return jwt.decode(token) as TokenPayload | null;
    }
}

export default JWTUtil;
