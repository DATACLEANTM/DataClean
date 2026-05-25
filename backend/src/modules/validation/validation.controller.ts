import { Request, Response } from 'express';
import { ValidationService } from './validation.service';
import { prisma } from '../../config/database';
import { ValidationRule } from './validation.types';
import { MappingService } from '../column-mapping/mapping.service';

const validationService = new ValidationService();
const mappingService = new MappingService();

const validationProgress = new Map<number, {
  current: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}>();

async function processValidation(fileId: number, records: any[], mappings: { originalColumnName: string; mappedField: string }[]) {
  const totalSteps = 5;
  validationProgress.set(fileId, { current: 1, total: totalSteps, status: 'processing' });

  try {
    await new Promise((r) => setTimeout(r, 500));
    validationProgress.set(fileId, { current: 2, total: totalSteps, status: 'processing' });

    await validationService.runValidation(fileId, records, mappings);
    validationProgress.set(fileId, { current: 3, total: totalSteps, status: 'processing' });

    await new Promise((r) => setTimeout(r, 300));
    validationProgress.set(fileId, { current: 4, total: totalSteps, status: 'processing' });

    await new Promise((r) => setTimeout(r, 300));
    validationProgress.set(fileId, { current: totalSteps, total: totalSteps, status: 'completed' });
  } catch {
    validationProgress.set(fileId, { current: 0, total: totalSteps, status: 'failed' });
  }
}

export const runValidation = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId as string, 10);

    if (!fileId || isNaN(fileId)) {
      return res.status(400).json({ error: 'fileId debe ser un ID numérico válido' });
    }

    const file = await prisma.uploadedFile.findUnique({ where: { id: fileId } });
    if (!file) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    const dbMappings = (await mappingService.getMappings(fileId)).map((m) => ({
      originalColumnName: m.originalColumnName,
      mappedField: m.mappedField,
    }));

    if (!dbMappings || dbMappings.length === 0) {
      return res.status(400).json({ error: 'No hay mapeos guardados para este archivo' });
    }

    validationProgress.set(fileId, { current: 0, total: 5, status: 'pending' });
    res.status(202).json({ success: true, message: 'Validación iniciada', data: { fileId, status: 'pending' } });

    const records = await validationService.loadFileRecords(fileId);

    processValidation(fileId, records, dbMappings);
  } catch (error) {
    console.error('Error en runValidation:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getValidationStatus = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId as string, 10);

    if (!fileId || isNaN(fileId)) {
      return res.status(400).json({ error: 'fileId debe ser un ID numérico válido' });
    }

    const progress = validationProgress.get(fileId);

    if (!progress) {
      return res.json({ success: true, data: { fileId, current: 0, total: 5, status: 'not_found' } });
    }

    res.json({ success: true, data: { fileId, ...progress } });
  } catch (error) {
    console.error('Error en getValidationStatus:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getValidationResults = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId as string, 10);

    if (!fileId || isNaN(fileId)) {
      return res.status(400).json({ error: 'fileId debe ser un ID numérico válido' });
    }

    const analysis = await prisma.analysisHistory.findFirst({
      where: { fileId },
      orderBy: { analyzedAt: 'desc' },
    });

    const errors = await prisma.detectedError.findMany({
      where: { fileId },
      include: { errorType: true },
    });

    const errorsByType: Record<string, number> = {};
    for (const error of errors) {
      const ruleName = error.errorType.name;
      errorsByType[ruleName] = (errorsByType[ruleName] || 0) + 1;
    }

    const result = {
      fileId,
      totalRecords: analysis?.totalRecords ?? 0,
      totalErrors: analysis?.totalErrors ?? errors.length,
      qualityScore: analysis?.qualityScore ?? 0,
      errorsByType: {
        exact_duplicate: errorsByType['exact_duplicate'] ?? 0,
        fuzzy_duplicate: errorsByType['fuzzy_duplicate'] ?? 0,
        missing_field: errorsByType['missing_field'] ?? 0,
        invalid_email: errorsByType['invalid_email'] ?? 0,
        invalid_phone: errorsByType['invalid_phone'] ?? 0,
        invalid_date: errorsByType['invalid_date'] ?? 0,
        out_of_range: errorsByType['out_of_range'] ?? 0,
        referential_inconsistency: errorsByType['referential_inconsistency'] ?? 0,
        business_contradiction: errorsByType['business_contradiction'] ?? 0,
      },
    };

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error en getValidationResults:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getValidationErrors = async (req: Request, res: Response) => {
  try {
    const fileId = parseInt(req.params.fileId as string, 10);

    if (!fileId || isNaN(fileId)) {
      return res.status(400).json({ error: 'fileId debe ser un ID numérico válido' });
    }

    const detectedErrors = await prisma.detectedError.findMany({
      where: { fileId },
      include: { errorType: true },
      orderBy: { rowNumber: 'asc' },
    });

    const grouped: Record<number, { recordId: number; rowNumber: number; errors: any[] }> = {};

    for (const de of detectedErrors) {
      if (!grouped[de.rowNumber]) {
        grouped[de.rowNumber] = {
          recordId: de.id,
          rowNumber: de.rowNumber,
          errors: [],
        };
      }
      grouped[de.rowNumber].errors.push({
        rule: de.errorType.name,
        fieldName: de.fieldName,
        detectedValue: de.detectedValue,
        message: de.message,
        severity: de.errorType.severity,
      });
    }

    const data = Object.values(grouped);

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error en getValidationErrors:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
