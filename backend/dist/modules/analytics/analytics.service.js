"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsSummary = void 0;
// src/modules/analytics/analytics.service.ts
const database_1 = require("../../config/database");
const getAnalyticsSummary = async (fileId) => {
    // 1. Obtener el archivo subido para saber el total de registros procesados
    const file = await database_1.prisma.uploadedFile.findUnique({
        where: { id: fileId }
    });
    if (!file) {
        throw new Error('FILE_NOT_FOUND');
    }
    // Métrica entera con el volumen absoluto de líneas [cite: 69]
    const totalRecords = file.rowCount || 0;
    // 2. Obtener todos los errores detectados asociados a este archivo específico
    const errors = await database_1.prisma.detectedError.findMany({
        where: { fileId: fileId },
        include: {
            errorType: true
        }
    });
    // Sumatoria global de incidencias [cite: 70]
    const totalErrors = errors.length;
    // 3. Inicializar contadores para las categorías de errores
    let duplicates = 0;
    let missingFields = 0;
    let formatErrors = 0;
    let businessErrors = 0;
    // 4. Clasificar cada error iterando sobre los resultados
    errors.forEach(error => {
        // Obtenemos el nombre del tipo de error (manejando posibles nulos de forma segura)
        const errorName = error.errorType?.name?.toLowerCase() || '';
        if (errorName.includes('duplicate')) {
            duplicates++;
        }
        else if (errorName.includes('missing') || errorName.includes('empty')) {
            missingFields++;
        }
        else if (errorName.includes('format')) {
            formatErrors++;
        }
        else if (errorName.includes('business') ||
            errorName.includes('range') ||
            errorName.includes('referential')) {
            businessErrors++;
        }
    });
    // 5. Calcular el Quality Score (Algoritmo de 0% a 100%) 
    let qualityScore = 0;
    if (totalRecords > 0) {
        // Obtenemos cuántas filas únicas tienen al menos un error
        const recordsWithErrors = new Set(errors.map(e => e.recordId)).size;
        // Las filas sanas son el total menos las que tienen errores
        const healthyRecords = totalRecords - recordsWithErrors;
        // Calculamos el porcentaje y lo redondeamos
        qualityScore = Math.max(0, Math.round((healthyRecords / totalRecords) * 100));
    }
    // 6. Retornar el objeto estructurado exactamente como lo pide nuestra interfaz
    return {
        totalRecords,
        totalErrors,
        duplicates,
        missingFields,
        formatErrors,
        businessErrors,
        qualityScore
    };
};
exports.getAnalyticsSummary = getAnalyticsSummary;
