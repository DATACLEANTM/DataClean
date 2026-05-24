"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (msg, data) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, data ?? '');
    },
    error: (msg, error) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, error ?? '');
    },
    warn: (msg, data) => {
        console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, data ?? '');
    },
};
