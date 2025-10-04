import { Router } from 'express';
import { smartSamplingController } from '../controllers/smart-sampling.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/v1/smart-sampling/configs
 * @desc    Get available smart sampling configurations
 * @access  Private
 */
router.get('/configs', authenticate, smartSamplingController.getConfigs);

/**
 * @route   POST /api/v1/smart-sampling/analyze
 * @desc    Start smart sampling analysis
 * @access  Private
 */
router.post('/analyze', authenticate, smartSamplingController.startAnalysis);

/**
 * @route   GET /api/v1/smart-sampling/analyze/:id
 * @desc    Get smart sampling analysis status and results
 * @access  Private
 */
router.get('/analyze/:id', authenticate, smartSamplingController.getAnalysis);

/**
 * @route   GET /api/v1/smart-sampling/analyze/:id/moments
 * @desc    Get critical moments from analysis
 * @access  Private
 */
router.get('/analyze/:id/moments', authenticate, smartSamplingController.getCriticalMoments);

/**
 * @route   GET /api/v1/smart-sampling/analyze/:id/pm-insights
 * @desc    Get PM-specific analysis insights
 * @access  Private
 */
router.get('/analyze/:id/pm-insights', authenticate, smartSamplingController.getPMInsights);

/**
 * @route   POST /api/v1/smart-sampling/analyze/:id/export
 * @desc    Export analysis results in various formats
 * @access  Private
 */
router.post('/analyze/:id/export', authenticate, smartSamplingController.exportAnalysis);

/**
 * @route   GET /api/v1/smart-sampling/analytics
 * @desc    Get user smart sampling analytics
 * @access  Private
 */
router.get('/analytics', authenticate, smartSamplingController.getAnalytics);

/**
 * @route   POST /api/v1/smart-sampling/batch-analyze
 * @desc    Start batch analysis for multiple meetings
 * @access  Private
 */
router.post('/batch-analyze', authenticate, smartSamplingController.startBatchAnalysis);

/**
 * @route   GET /api/v1/smart-sampling/batch-analyze/:id
 * @desc    Get batch analysis progress
 * @access  Private
 */
router.get('/batch-analyze/:id', authenticate, smartSamplingController.getBatchAnalysis);

export default router;