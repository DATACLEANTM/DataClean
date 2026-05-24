"use strict";
// validation.routes.ts
// Rutas del módulo de validación
// Shara - Validation Engine Core
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validation_controller_1 = require("./validation.controller");
const router = (0, express_1.Router)();
// Ejecutar validaciones sobre un archivo
router.post('/run/:fileId', validation_controller_1.runValidation);
// Obtener resumen de resultados
router.get('/results/:fileId', validation_controller_1.getValidationResults);
// Obtener lista detallada de errores
router.get('/errors/:fileId', validation_controller_1.getValidationErrors);
exports.default = router;
