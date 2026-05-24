import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UploadController } from './upload.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { env } from '../../config/env';

const router = Router();
const uploadController = new UploadController();

const uploadPath = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadPath),
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

router.post('/', authMiddleware, upload.single('file'), (req, res) =>
    uploadController.upload(req, res)
);

router.get('/history', authMiddleware, (req, res) =>
    uploadController.getHistory(req, res)
);

export default router;