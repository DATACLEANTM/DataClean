"use strict";
// validation.service.ts
// Motor principal de validación de DataClean
// Shara - Validation Engine Core
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const date_fns_1 = require("date-fns");
class ValidationService {
    /**
     * Ejecuta todas las validaciones sobre un archivo
     */
    async runValidation(fileId, records, mappings) {
        const allErrors = [];
        // Procesar cada registro (fila del archivo)
        for (let index = 0; index < records.length; index++) {
            const record = records[index];
            const rowNumber = index + 1;
            // Aplicar cada regla de validación
            const errors = await this.validateRecord(record, rowNumber, mappings);
            allErrors.push(...errors);
        }
        // Calcular resumen estadístico
        const summary = this.calculateSummary(fileId, records.length, allErrors);
        // Aquí luego guardarás los errores en la base de datos
        // await this.saveErrorsToDatabase(fileId, allErrors);
        return summary;
    }
    /**
     * Valida un registro individual contra todas las reglas
     */
    async validateRecord(record, rowNumber, mappings) {
        const errors = [];
        // Crear un mapa de campo -> valor según el mapeo
        const mappedData = this.mapRecordToFields(record, mappings);
        // 1. EXACT DUPLICATE DETECTION
        const exactErrors = await this.checkExactDuplicates(mappedData);
        errors.push(...exactErrors);
        // 2. FUZZY DUPLICATE DETECTION (aproximados)
        const fuzzyErrors = await this.checkFuzzyDuplicates(mappedData);
        errors.push(...fuzzyErrors);
        // 3. MISSING CRITICAL FIELDS (campos obligatorios vacíos)
        const missingErrors = await this.checkMissingFields(mappedData);
        errors.push(...missingErrors);
        // 4. INVALID FORMATS (email, teléfono, IDs)
        const formatErrors = await this.checkInvalidFormats(mappedData);
        errors.push(...formatErrors);
        // 5. IMPOSSIBLE DATES (fechas ilógicas)
        const dateErrors = await this.checkImpossibleDates(mappedData);
        errors.push(...dateErrors);
        return errors;
    }
    /**
     * Mapea los campos originales del archivo a los campos del sistema
     */
    mapRecordToFields(record, mappings) {
        const mapped = {};
        for (const mapping of mappings) {
            const originalValue = record[mapping.originalColumnName];
            mapped[mapping.mappedField] = originalValue;
        }
        return mapped;
    }
    /**
     * 1. DETECCIÓN DE DUPLICADOS EXACTOS
     * Compara si el registro actual es idéntico a otro
     */
    async checkExactDuplicates(mappedData) {
        const errors = [];
        // Esta función necesita acceso a todos los registros.
        // La implementaremos completamente después.
        return errors;
    }
    /**
     * 2. DETECCIÓN DE DUPLICADOS APROXIMADOS (FUZZY)
     * Usa Fuse.js para encontrar similitudes tipográficas
     */
    async checkFuzzyDuplicates(mappedData) {
        const errors = [];
        // Implementación con Fuse.js vendrá aquí
        return errors;
    }
    /**
     * 3. CAMPOS OBLIGATORIOS FALTANTES
     * Verifica que campos críticos tengan valor
     */
    async checkMissingFields(mappedData) {
        const errors = [];
        // Lista de campos obligatorios según el negocio
        const criticalFields = ['name', 'email', 'phone', 'id'];
        for (const field of criticalFields) {
            const value = mappedData[field];
            if (!value || value === '' || value === null || value === undefined) {
                errors.push({
                    rule: 'missing_field',
                    fieldName: field,
                    detectedValue: value,
                    message: `Campo obligatorio '${field}' está vacío`,
                    severity: 'CRITICAL'
                });
            }
        }
        return errors;
    }
    /**
     * 4. VALIDACIÓN DE FORMATOS INVÁLIDOS
     * Email, teléfono, IDs con expresiones regulares
     */
    async checkInvalidFormats(mappedData) {
        const errors = [];
        // Validar email
        const email = mappedData['email'];
        if (email && typeof email === 'string') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push({
                    rule: 'invalid_email',
                    fieldName: 'email',
                    detectedValue: email,
                    message: `El email '${email}' no tiene un formato válido`,
                    severity: 'WARNING'
                });
            }
        }
        // Validar teléfono (formato internacional básico)
        const phone = mappedData['phone'];
        if (phone && typeof phone === 'string') {
            const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
            if (!phoneRegex.test(phone)) {
                errors.push({
                    rule: 'invalid_phone',
                    fieldName: 'phone',
                    detectedValue: phone,
                    message: `El teléfono '${phone}' no tiene un formato válido`,
                    severity: 'WARNING'
                });
            }
        }
        return errors;
    }
    /**
     * 5. VALIDACIÓN DE FECHAS IMPOSIBLES
     * Usa date-fns para verificar fechas lógicas
     */
    async checkImpossibleDates(mappedData) {
        const errors = [];
        const dateField = mappedData['date'] || mappedData['createdAt'] || mappedData['fecha'];
        if (dateField && typeof dateField === 'string') {
            // Intentar parsear la fecha
            const parsedDate = (0, date_fns_1.parse)(dateField, 'yyyy-MM-dd', new Date());
            if (!(0, date_fns_1.isValid)(parsedDate)) {
                errors.push({
                    rule: 'invalid_date',
                    fieldName: 'date',
                    detectedValue: dateField,
                    message: `La fecha '${dateField}' no es válida`,
                    severity: 'WARNING'
                });
            }
            else if ((0, date_fns_1.isFuture)(parsedDate)) {
                errors.push({
                    rule: 'invalid_date',
                    fieldName: 'date',
                    detectedValue: dateField,
                    message: `La fecha '${dateField}' es futura (no puede existir en registros históricos)`,
                    severity: 'CRITICAL'
                });
            }
        }
        return errors;
    }
    /**
     * Calcula el resumen estadístico y Quality Score
     */
    calculateSummary(fileId, totalRecords, allErrors) {
        // Agrupar errores por tipo
        const errorsByType = {
            exact_duplicate: 0,
            fuzzy_duplicate: 0,
            missing_field: 0,
            invalid_email: 0,
            invalid_phone: 0,
            invalid_date: 0,
            out_of_range: 0,
            referential_inconsistency: 0,
            business_contradiction: 0
        };
        for (const error of allErrors) {
            errorsByType[error.rule]++;
        }
        const totalErrors = allErrors.length;
        // Calcular Quality Score (0-100)
        // Fórmula: (registros sin errores / total registros) * 100
        // Simplificado: asumiendo que cada error afecta un registro diferente
        const recordsWithErrors = new Set(); // Idealmente contar registros únicos con errores
        let qualityScore = 100;
        if (totalErrors > 0 && totalRecords > 0) {
            // Penalización básica
            const penalty = Math.min(100, (totalErrors / totalRecords) * 100);
            qualityScore = Math.max(0, 100 - penalty);
        }
        return {
            fileId,
            totalRecords,
            totalErrors,
            errorsByType,
            qualityScore: Math.round(qualityScore)
        };
    }
}
exports.ValidationService = ValidationService;
