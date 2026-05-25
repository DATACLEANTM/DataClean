import { Router } from 'express';
import { runValidation, getValidationStatus, getValidationResults, getValidationErrors } from './validation.controller';

const router = Router();

router.post('/run/:fileId', runValidation);
router.get('/status/:fileId', getValidationStatus);
router.get('/results/:fileId', getValidationResults);
router.get('/errors/:fileId', getValidationErrors);

export default router;
