"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingService = void 0;
const fuse_js_1 = __importDefault(require("fuse.js"));
const database_1 = require("../../config/database");
const STANDARD_FIELDS = [
    'nombre', 'apellido', 'email', 'correo', 'telefono', 'direccion',
    'ciudad', 'pais', 'fecha_nacimiento', 'edad', 'genero',
    'id', 'codigo', 'precio', 'cantidad', 'fecha', 'estado',
    'descripcion', 'categoria', 'empresa', 'cargo',
];
class MappingService {
    detectColumns(columns) {
        const fuse = new fuse_js_1.default(STANDARD_FIELDS, { threshold: 0.4 });
        return columns.map((col) => {
            const normalized = col.toLowerCase().replace(/[_\s-]/g, '');
            const results = fuse.search(normalized);
            return {
                originalName: col,
                suggestedField: results[0]?.item ?? 'desconocido',
                confidence: results[0] ? parseFloat((1 - (results[0].refIndex !== undefined ? (results[0].score ?? 1) : 1)).toFixed(2)) : 0,
            };
        });
    }
    async saveMappings(data, userId) {
        await database_1.prisma.columnMapping.deleteMany({ where: { fileId: data.fileId } });
        const mappings = await database_1.prisma.columnMapping.createMany({
            data: data.mappings.map((m) => ({
                fileId: data.fileId,
                originalColumnName: m.originalColumnName,
                mappedField: m.mappedField,
            })),
        });
        return mappings;
    }
    async getMappings(fileId) {
        return database_1.prisma.columnMapping.findMany({
            where: { fileId },
            select: {
                id: true,
                originalColumnName: true,
                mappedField: true,
                createdAt: true,
            },
        });
    }
}
exports.MappingService = MappingService;
