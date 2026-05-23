// tests/reports.test.ts
import request from 'supertest';
import express from 'express';
import reportsRoutes from '../src/modules/reports/reports.routes';

const app = express();
app.use(express.json());
app.use('/api/reports', reportsRoutes);

describe('Módulo Reports - Endpoints', () => {
    it('Debe exponer el endpoint del historial corporativo', async () => {
        const response = await request(app).get('/api/reports/history');
        expect(response.type).toBe('application/json');
        expect(response.status).toBeDefined();
    });

    it('Debe exponer el endpoint de errores por archivo', async () => {
        const fakeFileId = 'test-file-999';
        const response = await request(app).get(`/api/reports/errors/${fakeFileId}`);
        expect(response.type).toBe('application/json');
        expect(response.status).toBeDefined();
    });
});