import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { UploadController } from './upload.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { env } from '../../config/env';

const router = Router();
const uploadController = new UploadController();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, env.uploadDir),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: env.maxFileSize },
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (env.allowedFileTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    },
});

router.post('/', authMiddleware, upload.single('file'), (req, res) => uploadController.upload(req as any, res));
router.get('/history', authMiddleware, (req, res) => uploadController.getHistory(req as any, res));

export default router;