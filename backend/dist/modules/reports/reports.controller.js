"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryReport = exports.getErrorsReport = void 0;
const reports_service_1 = require("./reports.service");
const getErrorsReport = async (req, res) => {
    try {
        const fileId = parseInt(req.params.fileId, 10);
        if (!fileId || isNaN(fileId)) {
            res.status(400).json({ error: 'El parámetro fileId debe ser un ID numérico válido.' });
            return;
        }
        const errors = await (0, reports_service_1.getFileErrors)(fileId);
        res.status(200).json(errors);
    }
    catch (error) {
        if (error.message === 'FILE_NOT_FOUND') {
            res.status(404).json({ error: 'Archivo no encontrado.' });
            return;
        }
        console.error('Error al generar el reporte de errores:', error);
        res.status(500).json({ error: 'Error interno al consultar los detalles de errores.' });
    }
};
exports.getErrorsReport = getErrorsReport;
const getHistoryReport = async (req, res) => {
    try {
        const history = await (0, reports_service_1.getAnalysisHistory)();
        res.status(200).json(history);
    }
    catch (error) {
        console.error('Error al consultar el historial:', error);
        res.status(500).json({ error: 'Error interno al consultar el historial de auditorías.' });
    }
};
exports.getHistoryReport = getHistoryReport;
