import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { RegisterDTO, LoginDTO, JwtPayload, UpdateProfileDTO } from './auth.types';

export class AuthService {
    async register(data: RegisterDTO) {
        const exists = await prisma.user.findUnique({ where: { email: data.email } });
        if (exists) throw new Error('El email ya está registrado');

        if (data.password.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: { name: data.name, email: data.email, password: hashedPassword },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        const token = this.generateToken(user);
        return { user, token };
    }

    async login(data: LoginDTO) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) throw new Error('Credenciales inválidas');

        const valid = await bcrypt.compare(data.password, user.password);
        if (!valid) throw new Error('Credenciales inválidas');

        const token = this.generateToken(user);
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    async updateProfile(userId: number, data: UpdateProfileDTO) {
        if (data.email) {
            const existing = await prisma.user.findUnique({ where: { email: data.email } });
            if (existing && existing.id !== userId) {
                throw new Error('El email ya está registrado por otro usuario');
            }
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.email !== undefined && { email: data.email }),
            },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        return { user };
    }

    private generateToken(user: { id: number; email: string; role: string }) {
        const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
        return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as object);
    }
}