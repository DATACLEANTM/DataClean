export interface ColumnMappingDTO {
    fileId: number;
    mappings: {
        originalColumnName: string;
        mappedField: string;
    }[];
}

export interface DetectedColumn {
    originalName: string;
    suggestedField: string;
    confidence: number;
}