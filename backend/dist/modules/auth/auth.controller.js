"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const authService = new auth_service_1.AuthService();
class AuthController {
    async register(req, res) {
        try {
            const result = await authService.register(req.body);
            res.status(201).json({ success: true, data: result });
        }
        catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
    async login(req, res) {
        try {
            const result = await authService.login(req.body);
            res.json({ success: true, data: result });
        }
        catch (error) {
            res.status(401).json({ success: false, message: error.message });
        }
    }
}
exports.AuthController = AuthController;
