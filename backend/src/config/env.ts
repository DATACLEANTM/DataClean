import dotenv from 'dotenv';
dotenv.config();

export const env = {
    port: parseInt(process.env.PORT || '3001'),
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || '.csv,.xlsx').split(','),
    databaseUrl: process.env.DATABASE_URL || 'file:./dataclean.db',
};