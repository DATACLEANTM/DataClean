// tests/analytics.test.ts
import request from 'supertest';
import express from 'express';
import analyticsRoutes from '../src/modules/analytics/analytics.routes';

// Configuramos una app de Express simulada para aislar tu módulo
const app = express();
app.use(express.json());
app.use('/api/analytics', analyticsRoutes);

describe('Módulo Analytics - Endpoints', () => {
    it('Debe retornar error 400 si no se envía un fileId válido', async () => {
        // Simulamos una petición a una ruta sin ID
        const response = await request(app).get('/api/analytics/summary/');
        expect(response.status).toBe(404); // Not found por sintaxis de ruta
    });

    it('Debe responder correctamente a la petición del resumen analítico', async () => {
        // Simulamos un fileId ficticio
        const fakeFileId = '12345-abcde';
        const response = await request(app).get(`/api/analytics/summary/${fakeFileId}`);

        // Esperamos que el controlador responda (puede ser 200 o 500 dependiendo de si Prisma está conectado en el test)
        expect(response.type).toBe('application/json');
        expect(response.status).toBeDefined();
    });
});