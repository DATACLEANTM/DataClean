export interface ColumnMappingDTO {
    fileId: string;
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