// validation.routes.ts
// Rutas del módulo de validación
// Shara - Validation Engine Core

import { Router } from 'express';
import { runValidation, getValidationResults, getValidationErrors } from './validation.controller';

const router = Router();

// Ejecutar validaciones sobre un archivo
router.post('/run/:fileId', runValidation);

// Obtener resumen de resultados
router.get('/results/:fileId', getValidationResults);

// Obtener lista detallada de errores
router.get('/errors/:fileId', getValidationErrors);

export default router;