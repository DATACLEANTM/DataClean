import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import { RegisterDTO, LoginDTO, JwtPayload } from './auth.types';

export class AuthService {
    async register(data: RegisterDTO) {
        const exists = await prisma.user.findUnique({ where: { email: data.email } });
        if (exists) throw new Error('El email ya está registrado');

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

    private generateToken(user: { id: number; email: string; role: string }) {
        const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
        return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as object);
    }
}