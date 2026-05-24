"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const upload_controller_1 = require("./upload.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const env_1 = require("../../config/env");
const router = (0, express_1.Router)();
const uploadController = new upload_controller_1.UploadController();
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, env_1.env.uploadDir),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: env_1.env.maxFileSize },
    fileFilter: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (env_1.env.allowedFileTypes.includes(ext)) {
            cb(null, true);
        }
        else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    },
});
router.post('/', auth_middleware_1.authMiddleware, upload.single('file'), (req, res) => uploadController.upload(req, res));
router.get('/history', auth_middleware_1.authMiddleware, (req, res) => uploadController.getHistory(req, res));
exports.default = router;
