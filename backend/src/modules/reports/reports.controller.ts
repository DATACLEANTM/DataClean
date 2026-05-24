// src/modules/reports/reports.controller.ts
import { Request, Response } from 'express';
import { getFileErrors, getFileAnalysis, getAnalysisHistory } from './reports.service';

export const getErrorsReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const fileId = parseInt(req.params.fileId as string, 10);
        if (!fileId || isNaN(fileId)) {
            res.status(400).json({ error: 'El parámetro fileId debe ser un ID numérico válido.' });
            return;
        }

        const errors = await getFileErrors(fileId);
        res.status(200).json(errors);
    } catch (error: any) {
        if (error.message === 'FILE_NOT_FOUND') {
            res.status(404).json({ error: 'Archivo no encontrado.' });
            return;
        }
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

export const getFileAnalysisReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const fileId = parseInt(req.params.fileId as string, 10);
        if (!fileId || isNaN(fileId)) {
            res.status(400).json({ error: 'El parámetro fileId debe ser un ID numérico válido.' });
            return;
        }

        const analysis = await getFileAnalysis(fileId);
        res.status(200).json(analysis);
    } catch (error: any) {
        if (error.message === 'FILE_NOT_FOUND') {
            res.status(404).json({ error: 'Archivo no encontrado.' });
            return;
        }
        if (error.message === 'ANALYSIS_NOT_FOUND') {
            res.status(404).json({ error: 'No se encontró análisis para este archivo.' });
            return;
        }
        console.error('Error al consultar el análisis del archivo:', error);
        res.status(500).json({ error: 'Error interno al consultar el análisis del archivo.' });
    }
};