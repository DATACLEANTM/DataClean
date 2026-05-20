import app from './app';
import { env } from './config/env';
import { prisma } from './config/database';

async function main() {
    try {
        await prisma.$connect();
        console.log('✅ Base de datos conectada');

        app.listen(env.port, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${env.port}`);
            console.log(`📊 Ambiente: ${env.nodeEnv}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar:', error);
        process.exit(1);
    }
}

main();