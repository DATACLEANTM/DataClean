// src/modules/reports/reports.service.ts
import { PrismaClient } from '@prisma/client';
import { ErrorDetail, AnalysisHistoryRecord } from './reports.types';

const prisma = new PrismaClient();

export const getFileErrors = async (fileId: string): Promise<ErrorDetail[]> => {
    // Consultamos los errores e incluimos los datos de la fila (record) y el tipo de error
    const errors = await prisma.detected_errors.findMany({
        where: { fileId: fileId },
        include: {
            error_types: true,
            records: true
        },
        orderBy: {
            records: { rowNumber: 'asc' } // Ordenamos por número de fila para el reporte
        }
    });

    // Mapeamos el resultado complejo de Prisma a nuestra interfaz limpia
    return errors.map(err => ({
        id: err.id,
        rowNumber: err.records?.rowNumber || 0,
        fieldName: err.fieldName,
        detectedValue: err.detectedValue || '',
        message: err.message,
        errorType: err.error_types?.name || 'UNKNOWN',
        severity: err.error_types?.severity || 'WARNING'
    }));
};

export const getAnalysisHistory = async (): Promise<AnalysisHistoryRecord[]> => {
    // Consultamos el historial global de la organización
    const history = await prisma.analysis_history.findMany({
        include: {
            uploaded_files: true
        },
        orderBy: {
            analyzedAt: 'desc' // Los análisis más recientes primero
        }
    });

    return history.map(h => ({
        id: h.id,
        fileId: h.fileId,
        filename: h.uploaded_files?.originalName || 'Archivo Desconocido',
        totalRecords: h.totalRecords,
        totalErrors: h.totalErrors,
        qualityScore: h.qualityScore,
        analyzedAt: h.analyzedAt
    }));
};