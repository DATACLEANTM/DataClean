"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingController = void 0;
const mapping_service_1 = require("./mapping.service");
const mappingService = new mapping_service_1.MappingService();
class MappingController {
    async detectColumns(req, res) {
        try {
            const { columns } = req.body;
            if (!columns || !Array.isArray(columns)) {
                res.status(400).json({ success: false, message: 'Se requiere array de columnas' });
                return;
            }
            const detected = mappingService.detectColumns(columns);
            res.json({ success: true, data: detected });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async confirmMappings(req, res) {
        try {
            const result = await mappingService.saveMappings(req.body, req.user.userId);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getMappings(req, res) {
        try {
            const fileId = parseInt(req.params.fileId, 10);
            if (!fileId || isNaN(fileId)) {
                res.status(400).json({ success: false, message: 'fileId debe ser un ID numérico válido.' });
                return;
            }
            const mappings = await mappingService.getMappings(fileId);
            res.json({ success: true, data: mappings });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.MappingController = MappingController;
