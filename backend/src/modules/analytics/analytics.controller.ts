// src/modules/analytics/analytics.controller.ts
import { Request, Response } from 'express';
import { getAnalyticsSummary } from './analytics.service';

export const getSummary = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extraemos el ID del archivo de los parámetros de la URL
        const { fileId } = req.params;

        if (!fileId) {
            res.status(400).json({ error: 'El parámetro fileId es requerido para el análisis.' });
            return;
        }

        // Llamamos a la función matemática que acabas de crear en el servicio
        const summary = await getAnalyticsSummary(fileId);

        // Retornamos el objeto estructurado con un código HTTP 200 (Éxito)
        res.status(200).json(summary);
    } catch (error) {
        console.error('Error al procesar el resumen analítico:', error);
        res.status(500).json({
            error: 'Error interno del servidor al calcular las métricas de calidad de datos.'
        });
    }
};