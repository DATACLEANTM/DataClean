// validation.controller.ts
// Controlador de validación - Maneja las peticiones HTTP
// Shara - Validation Engine Core

import { Request, Response } from 'express';
import { ValidationService } from './validation.service';
import { ValidationRunRequest } from './validation.types';

const validationService = new ValidationService();

/**
 * POST /api/validation/run/:fileId
 * Ejecuta el motor de validación sobre un archivo ya cargado
 */
export const runValidation = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId as string);
    const { mappings }: ValidationRunRequest = req.body;

    // Validar que el fileId sea válido
    if (isNaN(fileId)) {
      return res.status(400).json({ error: 'fileId debe ser un número válido' });
    }

    // Validar que existan mappings
    if (!mappings || mappings.length === 0) {
      return res.status(400).json({ error: 'Se requiere el mapeo de columnas' });
    }

    // TODO: Obtener los registros del archivo desde la base de datos
    // Por ahora, usamos datos de ejemplo
    const mockRecords = [
      { nombre: 'Juan Perez', email: 'juan@test.com', telefono: '123456789', fecha: '2024-01-15' },
      { nombre: 'Maria Lopez', email: 'maria@test.com', telefono: '987654321', fecha: '2025-12-01' },
      { nombre: '', email: 'correo-invalido', telefono: 'abc123', fecha: '2030-01-01' }
    ];

    // Ejecutar validaciones
    const summary = await validationService.runValidation(fileId, mockRecords, mappings);

    // TODO: Guardar resultados en analysis_history y detected_errors

    res.status(200).json({
      success: true,
      message: 'Validación completada',
      data: summary
    });

  } catch (error) {
    console.error('Error en runValidation:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * GET /api/validation/results/:fileId
 * Obtiene los resultados de validación de un archivo
 */
export const getValidationResults = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId as string);

    if (isNaN(fileId)) {
      return res.status(400).json({ error: 'fileId debe ser un número válido' });
    }

    // TODO: Obtener resultados desde analysis_history y detected_errors
    // Por ahora, retornamos un ejemplo
    const mockResults = {
      fileId,
      totalRecords: 100,
      totalErrors: 15,
      qualityScore: 85,
      errorsByType: {
        exact_duplicate: 2,
        fuzzy_duplicate: 1,
        missing_field: 5,
        invalid_email: 3,
        invalid_phone: 2,
        invalid_date: 2,
        out_of_range: 0,
        referential_inconsistency: 0,
        business_contradiction: 0
      }
    };

    res.status(200).json({
      success: true,
      data: mockResults
    });

  } catch (error) {
    console.error('Error en getValidationResults:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * GET /api/validation/errors/:fileId
 * Obtiene la lista detallada de errores por registro
 */
export const getValidationErrors = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId as string);

    if (isNaN(fileId)) {
      return res.status(400).json({ error: 'fileId debe ser un número válido' });
    }

    // TODO: Obtener errores desde detected_errors con JOIN a records
    const mockErrors = [
      {
        recordId: 1,
        rowNumber: 3,
        errors: [
          {
            rule: 'missing_field',
            fieldName: 'nombre',
            detectedValue: '',
            message: 'Campo obligatorio está vacío',
            severity: 'CRITICAL'
          },
          {
            rule: 'invalid_email',
            fieldName: 'email',
            detectedValue: 'correo-invalido',
            message: 'El email no tiene un formato válido',
            severity: 'WARNING'
          }
        ]
      }
    ];

    res.status(200).json({
      success: true,
      data: mockErrors
    });

  } catch (error) {
    console.error('Error en getValidationErrors:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};