import { Router } from 'express';
import { MappingController } from './mapping.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const mappingController = new MappingController();

router.post('/columns', authMiddleware, (req, res) => mappingController.detectColumns(req as any, res));
router.post('/confirm', authMiddleware, (req, res) => mappingController.confirmMappings(req as any, res));
router.get('/:fileId', authMiddleware, (req, res) => mappingController.getMappings(req as any, res));

export default router;