import { Request, Response, NextFunction } from 'express';
import { jwtService } from './jwt.service';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }

        const token = authHeader.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const payload = jwtService.verify(token);
        req.user = {
            userId: payload.userId,
            email: payload.email,
        };

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const optionalAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const payload = jwtService.verify(token);
            req.user = {
                userId: payload.userId,
                email: payload.email,
            };
        }

        next();
    } catch (error) {
        // Continue without auth
        next();
    }
};
