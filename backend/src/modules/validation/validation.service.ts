import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import * as XLSX from 'xlsx';
import { prisma } from '../../config/database';
import { env } from '../../config/env';

import {
  ValidationRule,
  ValidationResult,
  ValidationSummary,
  ColumnMapping
} from './validation.types';

import Fuse from 'fuse.js';
import { isValid, parse, isFuture } from 'date-fns';

export class ValidationService {

  async loadFileRecords(fileId: number): Promise<any[]> {
    const uploaded = await prisma.uploadedFile.findUnique({ where: { id: fileId } });
    if (!uploaded) throw new Error('Archivo no encontrado');

    const uploadDir = path.resolve(process.cwd(), env.uploadDir);
    const filePath = path.resolve(uploadDir, uploaded.filename);

    if (!fs.existsSync(filePath)) {
      throw new Error('Archivo no encontrado en el disco');
    }

    const ext = path.extname(uploaded.filename).toLowerCase();

    if (ext === '.csv') {
      return this.parseCSVRecords(filePath);
    } else if (ext === '.xlsx' || ext === '.xls') {
      return this.parseExcelRecords(filePath);
    }

    throw new Error('Tipo de archivo no soportado');
  }

  private parseCSVRecords(filePath: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const records: any[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: any) => { records.push(data); })
        .on('end', () => resolve(records))
        .on('error', reject);
    });
  }

  private parseExcelRecords(filePath: string): any[] {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
  }

  async runValidation(
    fileId: number,
    records: any[],
    mappings: ColumnMapping[]
  ): Promise<ValidationSummary> {

    const allErrors: ValidationResult[] = [];

    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const rowNumber = index + 1;

      const errors = await this.validateRecord(record, rowNumber, mappings);
      allErrors.push(...errors);
    }

    const duplicateErrors = this.checkExactDuplicates(records);
    allErrors.push(...duplicateErrors);

    const summary = this.calculateSummary(fileId, records.length, allErrors);
    await this.saveValidationResults(fileId, summary, allErrors);
    return summary;
  }

  private async validateRecord(
    record: any,
    rowNumber: number,
    mappings: ColumnMapping[]
  ): Promise<ValidationResult[]> {

    const errors: ValidationResult[] = [];
    const mappedData = this.mapRecordToFields(record, mappings);

    const fuzzyErrors = await this.checkFuzzyDuplicates(mappedData, rowNumber);
    errors.push(...fuzzyErrors);

    const missingErrors = await this.checkMissingFields(mappedData, rowNumber);
    errors.push(...missingErrors);

    const formatErrors = await this.checkInvalidFormats(mappedData, rowNumber);
    errors.push(...formatErrors);

    const dateErrors = await this.checkImpossibleDates(mappedData, rowNumber);
    errors.push(...dateErrors);

    return errors;
  }

  private mapRecordToFields(
    record: any,
    mappings: ColumnMapping[]
  ): Record<string, any> {

    const mapped: Record<string, any> = {};

    for (const mapping of mappings) {
      mapped[mapping.mappedField] = record[mapping.originalColumnName];
    }

    return mapped;
  }

  private checkExactDuplicates(records: any[]): ValidationResult[] {
    const errors: ValidationResult[] = [];
    const seen = new Set<string>();

    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const key = JSON.stringify(record);

      if (seen.has(key)) {
        errors.push({
          rule: 'exact_duplicate',
          fieldName: 'ALL_RECORD',
          detectedValue: record,
          message: 'Registro duplicado exacto detectado',
          severity: 'CRITICAL',
          rowNumber: index + 1
        });
      } else {
        seen.add(key);
      }
    }

    return errors;
  }

  private async checkFuzzyDuplicates(
    mappedData: Record<string, any>,
    rowNumber: number
  ): Promise<ValidationResult[]> {
    const errors: ValidationResult[] = [];
    return errors;
  }

  private async checkMissingFields(
    mappedData: Record<string, any>,
    rowNumber: number
  ): Promise<ValidationResult[]> {

    const errors: ValidationResult[] = [];
    const criticalFields = ['name', 'email', 'phone', 'id'];

    for (const field of criticalFields) {
      const value = mappedData[field];

      if (!value || value === '' || value === null || value === undefined) {
        errors.push({
          rule: 'missing_field',
          fieldName: field,
          detectedValue: value,
          message: `Campo obligatorio '${field}' está vacío`,
          severity: 'CRITICAL',
          rowNumber
        });
      }
    }

    return errors;
  }

  private async checkInvalidFormats(
    mappedData: Record<string, any>,
    rowNumber: number
  ): Promise<ValidationResult[]> {

    const errors: ValidationResult[] = [];

    const email = mappedData['email'];
    if (email && typeof email === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        errors.push({
          rule: 'invalid_email',
          fieldName: 'email',
          detectedValue: email,
          message: `El email '${email}' no tiene un formato válido`,
          severity: 'WARNING',
          rowNumber
        });
      }
    }

    const phone = mappedData['phone'];
    if (phone && typeof phone === 'string') {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;

      if (!phoneRegex.test(phone)) {
        errors.push({
          rule: 'invalid_phone',
          fieldName: 'phone',
          detectedValue: phone,
          message: `El teléfono '${phone}' no tiene un formato válido`,
          severity: 'WARNING',
          rowNumber
        });
      }
    }

    return errors;
  }

  private async checkImpossibleDates(
    mappedData: Record<string, any>,
    rowNumber: number
  ): Promise<ValidationResult[]> {

    const errors: ValidationResult[] = [];

    const dateField =
      mappedData['date'] ||
      mappedData['createdAt'] ||
      mappedData['fecha'];

    if (dateField && typeof dateField === 'string') {
      const parsedDate = parse(dateField, 'yyyy-MM-dd', new Date());

      if (!isValid(parsedDate)) {
        errors.push({
          rule: 'invalid_date',
          fieldName: 'date',
          detectedValue: dateField,
          message: `La fecha '${dateField}' no es válida`,
          severity: 'WARNING',
          rowNumber
        });
      } else if (isFuture(parsedDate)) {
        errors.push({
          rule: 'invalid_date',
          fieldName: 'date',
          detectedValue: dateField,
          message: `La fecha '${dateField}' es futura`,
          severity: 'CRITICAL',
          rowNumber
        });
      }
    }

    return errors;
  }

  private calculateSummary(
    fileId: number,
    totalRecords: number,
    allErrors: ValidationResult[]
  ): ValidationSummary {

    const errorsByType: Record<ValidationRule, number> = {
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

    let qualityScore = 100;

    if (totalErrors > 0 && totalRecords > 0) {
      const penalty = (totalErrors / (totalRecords * 5)) * 100;
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

  private async saveValidationResults(
    fileId: number,
    summary: ValidationSummary,
    allErrors: ValidationResult[]
  ): Promise<void> {
    await prisma.analysisHistory.create({
      data: {
        fileId,
        totalRecords: summary.totalRecords,
        totalErrors: summary.totalErrors,
        qualityScore: summary.qualityScore
      }
    });

    for (const error of allErrors) {
      let errorType = await prisma.errorType.findFirst({
        where: { name: error.rule }
      });

      if (!errorType) {
        errorType = await prisma.errorType.create({
          data: {
            name: error.rule,
            description: this.getErrorDescription(error.rule),
            severity: error.severity
          }
        });
      }

      await prisma.detectedError.create({
        data: {
          fileId,
          errorTypeId: errorType.id,
          rowNumber: error.rowNumber,
          fieldName: error.fieldName,
          detectedValue:
            typeof error.detectedValue === 'string'
              ? error.detectedValue
              : JSON.stringify(error.detectedValue),
          message: error.message
        }
      });
    }
  }

  private getErrorDescription(rule: ValidationRule): string {
    const descriptions: Record<ValidationRule, string> = {
      exact_duplicate: 'Registro duplicado exacto',
      fuzzy_duplicate: 'Registro duplicado aproximado',
      missing_field: 'Campo obligatorio faltante',
      invalid_email: 'Formato de email inválido',
      invalid_phone: 'Formato de teléfono inválido',
      invalid_date: 'Fecha inválida o ilógica',
      out_of_range: 'Valor fuera de rango permitido',
      referential_inconsistency: 'Inconsistencia referencial',
      business_contradiction: 'Contradicción de regla de negocio'
    };
    return descriptions[rule];
  }
}
