"use strict";
// src/modules/validation/rules/business-contradictions.rule.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBusinessContradictions = void 0;
const validateBusinessContradictions = (record, rowNumber) => {
    const errors = [];
    // Validar estado activo con fecha de baja
    if (record.estado && record.estado.toLowerCase() === 'activo' && record.fecha_baja) {
        errors.push({
            fieldName: 'estado / fecha_baja',
            detectedValue: `Estado: ${record.estado} | Baja: ${record.fecha_baja}`,
            message: 'Contradicción de negocio: Un registro marcado como Activo no puede poseer una Fecha de Baja.',
            errorType: 'BUSINESS_CONTRADICTION'
        });
    }
    // Validar coherencia cronológica (fecha_fin menor a fecha_inicio)
    if (record.fecha_inicio && record.fecha_fin) {
        const start = new Date(record.fecha_inicio);
        const end = new Date(record.fecha_fin);
        if (end < start) {
            errors.push({
                fieldName: 'fecha_fin',
                detectedValue: String(record.fecha_fin),
                message: 'Contradicción cronológica: La fecha de finalización no puede ser anterior a la fecha de inicio.',
                errorType: 'BUSINESS_CONTRADICTION'
            });
        }
    }
    return errors;
};
exports.validateBusinessContradictions = validateBusinessContradictions;
