// src/modules/reports/reports.controller.ts
import { Request, Response } from 'express';
import { getFileErrors, getAnalysisHistory } from './reports.service';

export const getErrorsReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fileId } = req.params;
        if (!fileId) {
            res.status(400).json({ error: 'El parámetro fileId es requerido.' });
            return;
        }

        const errors = await getFileErrors(fileId);
        res.status(200).json(errors);
    } catch (error) {
        console.error('Error al generar el reporte de errores:', error);
        res.status(500).json({ error: 'Error interno al consultar los detalles de errores.' });
    }
};

export const getHistoryReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const history = await getAnalysisHistory();
        res.status(200).json(history);
    } catch (error) {
        console.error('Error al consultar el historial:', error);
        res.status(500).json({ error: 'Error interno al consultar el historial de auditorías.' });
    }
};