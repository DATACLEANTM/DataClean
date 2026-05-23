// src/modules/validation/rules/referential.rule.ts

export const validateReferentialConsistency = (record: any, rowNumber: number) => {
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