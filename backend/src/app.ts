import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import authRoutes from './modules/auth/auth.routes';
import uploadRoutes from './modules/upload/upload.routes';
import mappingRoutes from './modules/column-mapping/mapping.routes';
import validationRoutes from './modules/validation/validation.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import reportsRoutes from './modules/reports/reports.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/mapping', mappingRoutes);
app.use('/api/validation', validationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportsRoutes);

app.use(errorMiddleware);

export default app;