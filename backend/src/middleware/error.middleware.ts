import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('❌ Error:', error.message);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
};