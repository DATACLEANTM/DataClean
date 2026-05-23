// src/modules/analytics/analytics.routes.ts
import { Router } from 'express';
import { getSummary } from './analytics.controller';

const router = Router();

// Endpoint oficial: GET /api/analytics/summary/:fileId
router.get('/summary/:fileId', getSummary);

export default router;