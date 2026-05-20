import { Response } from 'express';
import { UploadService } from './upload.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const uploadService = new UploadService();

export class UploadController {
    async upload(req: AuthRequest, res: Response) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No se proporcionó archivo' });
                return;
            }
            const result = await uploadService.processFile(req.file, req.user!.userId);
            res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getHistory(req: AuthRequest, res: Response) {
        try {
            const history = await uploadService.getHistory(req.user!.userId);
            res.json({ success: true, data: history });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
