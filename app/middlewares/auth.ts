import type { Request, Response, NextFunction } from 'express';
import JWTUtil from '../utils/jwt.js';
import { HTTP_STATUS } from '../constants/statusCodes.js';

export interface AuthRequest extends Request {
    userId?: string;
    role?: string | undefined;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'No token provided' });
            return;
        }

        const decoded = JWTUtil.verifyAccessToken(token);
        req.userId = decoded.userId;
        req.role = decoded.role;
        
        next();
    } catch (error) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid token' });
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.role || !roles.includes(req.role)) {
            res.status(HTTP_STATUS.FORBIDDEN).json({ error: 'Forbidden' });
            return;
        }
        next();
    };
};
