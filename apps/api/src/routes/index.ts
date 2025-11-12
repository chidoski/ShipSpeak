import { Router } from 'express';
import authRoutes from './auth.routes';
import meetingRoutes from './meeting.routes';
import scenarioRoutes from './scenario.routes';
import smartSamplingRoutes from './smart-sampling.routes';
import uploadRoutes from './upload.routes';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Business logic routes
router.use('/meetings', meetingRoutes);
router.use('/scenarios', scenarioRoutes);
router.use('/smart-sampling', smartSamplingRoutes);
router.use('/upload', uploadRoutes);

export default router;