// validation.types.ts
// Definición de tipos para el motor de validación de DataClean

export type ValidationRule = 
  | 'exact_duplicate' 
  | 'fuzzy_duplicate' 
  | 'missing_field' 
  | 'invalid_email' 
  | 'invalid_phone' 
  | 'invalid_date'
  | 'out_of_range'
  | 'referential_inconsistency'
  | 'business_contradiction';

export interface ValidationResult {
  rule: ValidationRule;
  fieldName: string;
  detectedValue: any;
  message: string;
  severity: 'CRITICAL' | 'WARNING';
}

export interface ValidationError {
  recordId: number;
  rowNumber: number;
  errors: ValidationResult[];
}

export interface ValidationSummary {
  fileId: number;
  totalRecords: number;
  totalErrors: number;
  errorsByType: Record<ValidationRule, number>;
  qualityScore: number;
}

export interface ColumnMapping {
  originalColumnName: string;
  mappedField: string;
}

export interface ValidationRunRequest {
  fileId: number;
  mappings: ColumnMapping[];
}