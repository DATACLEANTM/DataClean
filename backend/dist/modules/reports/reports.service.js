"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalysisHistory = exports.getFileErrors = void 0;
// src/modules/reports/reports.service.ts
const database_1 = require("../../config/database");
const getFileErrors = async (fileId) => {
    const file = await database_1.prisma.uploadedFile.findUnique({ where: { id: fileId } });
    if (!file) {
        throw new Error('FILE_NOT_FOUND');
    }
    const errors = await database_1.prisma.detectedError.findMany({
        where: { fileId: fileId },
        include: {
            errorType: true,
            record: true
        },
        orderBy: {
            record: { rowNumber: 'asc' }
        }
    });
    // Mapeamos el resultado complejo de Prisma a nuestra interfaz limpia
    return errors.map(err => ({
        id: err.id,
        rowNumber: err.record?.rowNumber || 0,
        fieldName: err.fieldName || '',
        detectedValue: err.detectedValue || '',
        message: err.message,
        errorType: err.errorType?.name || 'UNKNOWN',
        severity: err.errorType?.severity || 'WARNING'
    }));
};
exports.getFileErrors = getFileErrors;
const getAnalysisHistory = async () => {
    // Consultamos el historial global de la organización
    const history = await database_1.prisma.analysisHistory.findMany({
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
exports.getAnalysisHistory = getAnalysisHistory;
