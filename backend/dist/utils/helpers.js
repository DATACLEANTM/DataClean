"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = exports.sanitizeString = exports.formatFileSize = void 0;
const formatFileSize = (bytes) => {
    if (bytes < 1024)
        return `${bytes} B`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};
exports.formatFileSize = formatFileSize;
const sanitizeString = (str) => {
    return str.trim().toLowerCase().replace(/\s+/g, ' ');
};
exports.sanitizeString = sanitizeString;
const generateSlug = (str) => {
    return str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};
exports.generateSlug = generateSlug;
