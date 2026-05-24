"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = void 0;
const analytics_service_1 = require("./analytics.service");
const getSummary = async (req, res) => {
    try {
        const fileId = parseInt(req.params.fileId, 10);
        if (!fileId || isNaN(fileId)) {
            res.status(400).json({ error: 'El parámetro fileId debe ser un ID numérico válido.' });
            return;
        }
        const summary = await (0, analytics_service_1.getAnalyticsSummary)(fileId);
        res.status(200).json(summary);
    }
    catch (error) {
        if (error.message === 'FILE_NOT_FOUND') {
            res.status(404).json({ error: 'Archivo no encontrado.' });
            return;
        }
        console.error('Error al procesar el resumen analítico:', error);
        res.status(500).json({
            error: 'Error interno del servidor al calcular las métricas de calidad de datos.'
        });
    }
};
exports.getSummary = getSummary;
