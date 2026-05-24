"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/reports/reports.routes.ts
const express_1 = require("express");
const reports_controller_1 = require("./reports.controller");
const router = (0, express_1.Router)();
// Endpoint para obtener el reporte detallado de errores de un archivo específico
router.get('/errors/:fileId', reports_controller_1.getErrorsReport);
// Endpoint para el panel de historial del dashboard corporativo
router.get('/history', reports_controller_1.getHistoryReport);
exports.default = router;
