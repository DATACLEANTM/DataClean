"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const XLSX = __importStar(require("xlsx"));
const database_1 = require("../../config/database");
class UploadService {
    async processFile(file, userId) {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        let columns = [];
        let rowCount = 0;
        if (ext === '.csv') {
            const result = await this.parseCSV(file.path);
            columns = result.columns;
            rowCount = result.rowCount;
        }
        else if (ext === '.xlsx' || ext === '.xls') {
            const result = this.parseExcel(file.path);
            columns = result.columns;
            rowCount = result.rowCount;
        }
        const uploaded = await database_1.prisma.uploadedFile.create({
            data: {
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                rowCount,
                userId,
            },
        });
        return {
            fileId: uploaded.id,
            filename: uploaded.filename,
            originalName: uploaded.originalName,
            size: uploaded.size,
            rowCount: uploaded.rowCount,
            columns,
            uploadedAt: uploaded.uploadedAt,
        };
    }
    parseCSV(filePath) {
        return new Promise((resolve, reject) => {
            let columns = [];
            let rowCount = 0;
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on('headers', (headers) => { columns = headers; })
                .on('data', () => { rowCount++; })
                .on('end', () => resolve({ columns, rowCount }))
                .on('error', reject);
        });
    }
    parseExcel(filePath) {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const columns = data[0] || [];
        const rowCount = Math.max(0, data.length - 1);
        return { columns, rowCount };
    }
    async getHistory(userId) {
        return database_1.prisma.uploadedFile.findMany({
            where: { userId },
            orderBy: { uploadedAt: 'desc' },
            select: {
                id: true,
                originalName: true,
                size: true,
                rowCount: true,
                uploadedAt: true,
            },
        });
    }
}
exports.UploadService = UploadService;
