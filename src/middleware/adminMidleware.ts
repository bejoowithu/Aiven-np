
import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './authMiddleware.ts';

export default function adminMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void {
    if (!req.user || req.user.role !== 'admin') {
        res.status(403).json({
            message: 'Cuman buat atemin aja brow'
        });
        return;
    }

    next();
}
