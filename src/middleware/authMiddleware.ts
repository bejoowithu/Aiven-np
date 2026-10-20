import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserPayload {
    id: number;
    username: string;
    role: 'admin' | 'member';
}

export interface AuthRequest extends Request {
    user?: UserPayload;
}

export default function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        res.status(401).json({
            message: 'Token ngga ada brow'
        });
        return;
    }

    const token = header.split(' ')[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        if (typeof decoded === 'string' || !decoded.id ||
            !decoded.username ||
            !['admin', 'member'].includes(decoded.role)) {
            res.status(401).json({
                message: 'Token kaga valdi'
            });
            return;
        }

        req.user = {
            id: decoded.id as number,
            username: decoded.username as string,
            role: decoded.role as 'admin' | 'member'
        };

        next();
    } catch {
        res.status(401).json({
            message: 'Token kaga valdi atau udah kelamaan'
        });
    }
}