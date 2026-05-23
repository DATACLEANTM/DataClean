// src/modules/analytics/analytics.types.ts

export interface AnalyticsSummary {
    totalRecords: number;
    totalErrors: number;
    duplicates: number;
    missingFields: number;
    formatErrors: number;
    businessErrors: number;
    qualityScore: number;
}