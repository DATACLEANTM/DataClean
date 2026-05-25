import Fuse from 'fuse.js';
import { prisma } from '../../config/database';
import { ColumnMappingDTO, DetectedColumn } from './mapping.types';

const STANDARD_FIELDS = [
    'nombre', 'apellido', 'email', 'correo', 'telefono', 'direccion',
    'ciudad', 'pais', 'fecha_nacimiento', 'edad', 'genero',
    'id', 'codigo', 'precio', 'cantidad', 'fecha', 'estado',
    'descripcion', 'categoria', 'empresa', 'cargo',
];


export class MappingService {
    detectColumns(columns: string[]): DetectedColumn[] {
        const fuse = new Fuse(STANDARD_FIELDS, { threshold: 0.4 });

        return columns.map((col) => {
            const normalized = col.toLowerCase().replace(/[_\s-]/g, '');
            const results = fuse.search(normalized);

            return {
                originalName: col,
                suggestedField: results[0]?.item ?? 'desconocido',
                confidence: results[0] ? 1 : 0,
            };
        });
    }

    async saveMappings(data: ColumnMappingDTO, userId: number) {
        await prisma.columnMapping.deleteMany({ where: { fileId: data.fileId } });

        const mappings = await prisma.columnMapping.createMany({
            data: data.mappings.map((m) => ({
                fileId: data.fileId,
                originalColumnName: m.originalColumnName,
                mappedField: m.mappedField,
            })),
        });

        return mappings;
    }

    async getMappings(fileId: number) {
        return prisma.columnMapping.findMany({
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