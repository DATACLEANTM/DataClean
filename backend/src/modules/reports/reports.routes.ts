// src/modules/reports/reports.routes.ts
import { Router } from 'express';
import { getErrorsReport, getHistoryReport, getFileAnalysisReport } from './reports.controller';

const router = Router();

// Endpoint para obtener el reporte detallado de errores de un archivo específico
router.get('/errors/:fileId', getErrorsReport);

// Endpoint para el panel de historial del dashboard corporativo
router.get('/history', getHistoryReport);

// Endpoint para obtener el análisis de un archivo específico
router.get('/file/:fileId', getFileAnalysisReport);

export default router;