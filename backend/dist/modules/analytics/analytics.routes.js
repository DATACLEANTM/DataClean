"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/analytics/analytics.routes.ts
const express_1 = require("express");
const analytics_controller_1 = require("./analytics.controller");
const router = (0, express_1.Router)();
// Endpoint oficial: GET /api/analytics/summary/:fileId
router.get('/summary/:fileId', analytics_controller_1.getSummary);
exports.default = router;
