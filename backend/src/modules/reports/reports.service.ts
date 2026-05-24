// src/modules/reports/reports.service.ts
import { prisma } from '../../config/database';
import { ErrorDetail, AnalysisHistoryRecord } from './reports.types';

export const getFileErrors = async (fileId: number): Promise<ErrorDetail[]> => {
    const file = await prisma.uploadedFile.findUnique({ where: { id: fileId } });
    if (!file) {
        throw new Error('FILE_NOT_FOUND');
    }

    const errors = await prisma.detectedError.findMany({
        where: { fileId: fileId },
        include: {
            errorType: true
        },
        orderBy: {
            rowNumber: 'asc'
        }
    });

    // Mapeamos el resultado complejo de Prisma a nuestra interfaz limpia
    return errors.map(err => ({
        id: err.id,
        rowNumber: err.rowNumber,
        fieldName: err.fieldName || '',
        detectedValue: err.detectedValue || '',
        message: err.message,
        errorType: err.errorType?.name || 'UNKNOWN',
        severity: err.errorType?.severity || 'WARNING'
    }));
};

export const getFileAnalysis = async (fileId: number) => {
    const file = await prisma.uploadedFile.findUnique({ where: { id: fileId } });
    if (!file) {
        throw new Error('FILE_NOT_FOUND');
    }

    const analysis = await prisma.analysisHistory.findFirst({
        where: { fileId },
        orderBy: { analyzedAt: 'desc' }
    });

    if (!analysis) {
        throw new Error('ANALYSIS_NOT_FOUND');
    }

    return {
        fileId: analysis.fileId,
        filename: file.originalName,
        totalRecords: analysis.totalRecords,
        totalErrors: analysis.totalErrors,
        qualityScore: analysis.qualityScore,
        analyzedAt: analysis.analyzedAt
    };
};

export const getAnalysisHistory = async (): Promise<AnalysisHistoryRecord[]> => {
    // Consultamos el historial global de la organización
    const history = await prisma.analysisHistory.findMany({
        include: {
            file: true
        },
        orderBy: {
            analyzedAt: 'desc'
        }
    });

    return history.map(h => ({
        id: h.id,
        fileId: h.fileId,
        filename: h.file?.originalName || 'Archivo Desconocido',
        totalRecords: h.totalRecords,
        totalErrors: h.totalErrors,
        qualityScore: h.qualityScore,
        analyzedAt: h.analyzedAt
    }));
};