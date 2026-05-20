import { Response } from 'express';
import { MappingService } from './mapping.service';
import { AuthRequest } from '../../middleware/auth.middleware';

const mappingService = new MappingService();

export class MappingController {
    async detectColumns(req: AuthRequest, res: Response) {
        try {
            const { columns } = req.body;
            if (!columns || !Array.isArray(columns)) {
                res.status(400).json({ success: false, message: 'Se requiere array de columnas' });
                return;
            }
            const detected = mappingService.detectColumns(columns);
            res.json({ success: true, data: detected });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async confirmMappings(req: AuthRequest, res: Response) {
        try {
            const result = await mappingService.saveMappings(req.body, req.user!.userId);
            res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getMappings(req: AuthRequest, res: Response) {
        try {
            const { fileId } = req.params;
            const mappings = await mappingService.getMappings(fileId);
            res.json({ success: true, data: mappings });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}