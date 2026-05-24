"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const upload_service_1 = require("./upload.service");
const uploadService = new upload_service_1.UploadService();
class UploadController {
    async upload(req, res) {
        try {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No se proporcionó archivo' });
                return;
            }
            const result = await uploadService.processFile(req.file, req.user.userId);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    async getHistory(req, res) {
        try {
            const history = await uploadService.getHistory(req.user.userId);
            res.json({ success: true, data: history });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.UploadController = UploadController;
