import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../modules/auth/auth.types';

export interface AuthRequest extends Request {
    user?: JwtPayload;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Token no proporcionado' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    }
};