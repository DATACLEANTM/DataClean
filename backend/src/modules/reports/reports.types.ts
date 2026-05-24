// src/modules/reports/reports.types.ts

export interface ErrorDetail {
    id: number;
    rowNumber: number;
    fieldName: string;
    detectedValue: string;
    message: string;
    errorType: string;
    severity: string;
}

export interface AnalysisHistoryRecord {
    id: number;
    fileId: number;
    filename: string;
    totalRecords: number;
    totalErrors: number;
    qualityScore: number;
    analyzedAt: Date;
}