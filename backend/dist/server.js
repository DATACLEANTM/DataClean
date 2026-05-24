"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
async function main() {
    try {
        await database_1.prisma.$connect();
        console.log('✅ Base de datos conectada');
        app_1.default.listen(env_1.env.port, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${env_1.env.port}`);
            console.log(`📊 Ambiente: ${env_1.env.nodeEnv}`);
        });
    }
    catch (error) {
        console.error('❌ Error al iniciar:', error);
        process.exit(1);
    }
}
main();
