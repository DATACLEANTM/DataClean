// src/modules/analytics/analytics.service.ts
import { PrismaClient } from '@prisma/client';
import { AnalyticsSummary } from './analytics.types';

// Instanciamos el cliente de Prisma para interactuar con PostgreSQL
const prisma = new PrismaClient();

export const getAnalyticsSummary = async (fileId: string): Promise<AnalyticsSummary> => {
    // 1. Obtener el archivo subido para saber el total de registros procesados
    const file = await prisma.uploaded_files.findUnique({
        where: { id: fileId }
    });

    // Métrica entera con el volumen absoluto de líneas [cite: 69]
    const totalRecords = file?.rowCount || 0;

    // 2. Obtener todos los errores detectados asociados a este archivo específico
    const errors = await prisma.detected_errors.findMany({
        where: { fileId: fileId },
        include: {
            error_types: true // Incluimos la tabla relacionada para saber la categoría del error
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
        const errorName = error.error_types?.name?.toLowerCase() || '';

        if (errorName.includes('duplicate')) {
            duplicates++;
        } else if (errorName.includes('missing') || errorName.includes('empty')) {
            missingFields++;
        } else if (errorName.includes('format')) {
            formatErrors++;
        } else if (
            errorName.includes('business') ||
            errorName.includes('range') ||
            errorName.includes('referential')
        ) {
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