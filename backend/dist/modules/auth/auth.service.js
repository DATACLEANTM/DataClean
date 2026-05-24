"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../config/database");
const env_1 = require("../../config/env");
class AuthService {
    async register(data) {
        const exists = await database_1.prisma.user.findUnique({ where: { email: data.email } });
        if (exists)
            throw new Error('El email ya está registrado');
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const user = await database_1.prisma.user.create({
            data: { name: data.name, email: data.email, password: hashedPassword },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        const token = this.generateToken(user);
        return { user, token };
    }
    async login(data) {
        const user = await database_1.prisma.user.findUnique({ where: { email: data.email } });
        if (!user)
            throw new Error('Credenciales inválidas');
        const valid = await bcrypt_1.default.compare(data.password, user.password);
        if (!valid)
            throw new Error('Credenciales inválidas');
        const token = this.generateToken(user);
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    generateToken(user) {
        const payload = { userId: user.id, email: user.email, role: user.role };
        return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpiresIn });
    }
}
exports.AuthService = AuthService;
