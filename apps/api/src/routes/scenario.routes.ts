import { Router } from 'express';
import { scenarioController } from '../controllers/scenario.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/v1/scenarios
 * @desc    Get available scenarios with pagination and filtering
 * @access  Private
 */
router.get('/', authenticate, scenarioController.findAll);

/**
 * @route   GET /api/v1/scenarios/:id
 * @desc    Get scenario by id
 * @access  Private
 */
router.get('/:id', authenticate, scenarioController.findById);

/**
 * @route   POST /api/v1/scenarios/generate
 * @desc    Generate personalized scenarios
 * @access  Private
 */
router.post('/generate', authenticate, scenarioController.generateScenarios);

/**
 * @route   GET /api/v1/scenarios/generation/:id
 * @desc    Get scenario generation status and results
 * @access  Private
 */
router.get('/generation/:id', authenticate, scenarioController.getGenerationStatus);

/**
 * @route   POST /api/v1/scenarios/:id/practice
 * @desc    Start practice session for scenario
 * @access  Private
 */
router.post('/:id/practice', authenticate, scenarioController.startPractice);

/**
 * @route   GET /api/v1/scenarios/practice/sessions
 * @desc    Get user practice sessions
 * @access  Private
 */
router.get('/practice/sessions', authenticate, scenarioController.getPracticeSessions);

/**
 * @route   GET /api/v1/scenarios/practice/sessions/:id
 * @desc    Get practice session details
 * @access  Private
 */
router.get('/practice/sessions/:id', authenticate, scenarioController.getPracticeSession);

/**
 * @route   POST /api/v1/scenarios/practice/sessions/:id/response
 * @desc    Submit practice response
 * @access  Private
 */
router.post('/practice/sessions/:id/response', authenticate, scenarioController.submitResponse);

/**
 * @route   POST /api/v1/scenarios/practice/sessions/:id/complete
 * @desc    Complete practice session
 * @access  Private
 */
router.post('/practice/sessions/:id/complete', authenticate, scenarioController.completeSession);

export default router;