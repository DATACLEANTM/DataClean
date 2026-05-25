
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import * as XLSX from 'xlsx';
import { prisma } from '../../config/database';

export class UploadService {
    async processFile(file: Express.Multer.File, userId: number) {
        const ext = path.extname(file.originalname).toLowerCase();
        let columns: string[] = [];
        let rowCount = 0;

        if (ext === '.csv') {
            const result = await this.parseCSV(file.path);
            columns = result.columns;
            rowCount = result.rowCount;
        } else if (ext === '.xlsx' || ext === '.xls') {
            const result = this.parseExcel(file.path);
            columns = result.columns;
            rowCount = result.rowCount;
        }

        const uploaded = await prisma.uploadedFile.create({
            data: {
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                rowCount,
                columns,
                userId,
            },
        });

        return {
            fileId: uploaded.id,
            filename: uploaded.filename,
            originalName: uploaded.originalName,
            size: uploaded.size,
            rowCount: uploaded.rowCount,
            columns: uploaded.columns,
            uploadedAt: uploaded.uploadedAt,
        };
    }

    private parseCSV(filePath: string): Promise<{ columns: string[]; rowCount: number }> {
        return new Promise((resolve, reject) => {
            let columns: string[] = [];
            let rowCount = 0;

            fs.createReadStream(filePath)
                .pipe(csv())
                .on('headers', (headers: string[]) => { columns = headers; })
                .on('data', () => { rowCount++; })
                .on('end', () => resolve({ columns, rowCount }))
                .on('error', reject);
        });
    }

    private parseExcel(filePath: string): { columns: string[]; rowCount: number } {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

        const columns = data[0] || [];
        const rowCount = Math.max(0, data.length - 1);
        return { columns, rowCount };
    }

    async getHistory(userId: number) {
        return prisma.uploadedFile.findMany({
            where: { userId },
            orderBy: { uploadedAt: 'desc' },
            select: {
                id: true,
                originalName: true,
                filename: true,
                size: true,
                rowCount: true,
                columns: true,
                uploadedAt: true,
            },
        });
    }
}
