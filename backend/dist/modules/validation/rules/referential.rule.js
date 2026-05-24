"use strict";
// src/modules/validation/rules/referential.rule.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReferentialConsistency = void 0;
const validateReferentialConsistency = (record, rowNumber) => {
    const errors = [];
    // Validar pedido sin cliente asociado
    if (record.pedido_id && (!record.cliente_id || record.cliente_id.trim() === '')) {
        errors.push({
            fieldName: 'cliente_id',
            detectedValue: 'N/A',
            message: 'Inconsistencia referencial: Un pedido no puede estar huérfano, requiere un ID de cliente válido.',
            errorType: 'REFERENTIAL_ERROR'
        });
    }
    return errors;
};
exports.validateReferentialConsistency = validateReferentialConsistency;
