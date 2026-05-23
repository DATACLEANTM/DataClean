// src/modules/reports/reports.types.ts

export interface ErrorDetail {
    id: string;
    rowNumber: number;
    fieldName: string;
    detectedValue: string;
    message: string;
    errorType: string;
    severity: string;
}

export interface AnalysisHistoryRecord {
    id: string;
    fileId: string;
    filename: string;
    totalRecords: number;
    totalErrors: number;
    qualityScore: number;
    analyzedAt: Date;
}