// src/modules/validation/rules/out-of-range.rule.ts

export const validateOutOfRange = (record: any, rowNumber: number) => {
    const errors = [];

    // Validar edad negativa
    if (record.edad !== undefined && Number(record.edad) < 0) {
        errors.push({
            fieldName: 'edad',
            detectedValue: String(record.edad),
            message: 'Violación de rango: La edad no puede ser un número negativo.',
            errorType: 'OUT_OF_RANGE'
        });
    }

    // Validar stock negativo
    if (record.stock !== undefined && Number(record.stock) < 0) {
        errors.push({
            fieldName: 'stock',
            detectedValue: String(record.stock),
            message: 'Violación de rango: El inventario/stock no puede ser menor a cero.',
            errorType: 'OUT_OF_RANGE'
        });
    }

    // Validar salario irreal o negativo
    if (record.salario !== undefined && Number(record.salario) < 0) {
        errors.push({
            fieldName: 'salario',
            detectedValue: String(record.salario),
            message: 'Violación de rango: El salario corporativo no puede ser negativo.',
            errorType: 'OUT_OF_RANGE'
        });
    }

    // Validar porcentaje (debe estar entre 0 y 100)
    if (record.porcentaje !== undefined && (Number(record.porcentaje) < 0 || Number(record.porcentaje) > 100)) {
        errors.push({
            fieldName: 'porcentaje',
            detectedValue: String(record.porcentaje),
            message: 'Violación de rango: El porcentaje debe estar entre 0 y 100.',
            errorType: 'OUT_OF_RANGE'
        });
    }

    return errors;
};