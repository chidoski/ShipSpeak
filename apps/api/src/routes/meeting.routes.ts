import { Router } from 'express';
import { meetingController } from '../controllers/meeting.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/v1/meetings
 * @desc    Create a new meeting
 * @access  Private
 */
router.post('/', authenticate, meetingController.create);

/**
 * @route   GET /api/v1/meetings
 * @desc    Get user meetings with pagination and filtering
 * @access  Private
 */
router.get('/', authenticate, meetingController.findByUserId);

/**
 * @route   GET /api/v1/meetings/:id
 * @desc    Get meeting by id
 * @access  Private
 */
router.get('/:id', authenticate, meetingController.findById);

/**
 * @route   PUT /api/v1/meetings/:id
 * @desc    Update meeting details
 * @access  Private
 */
router.put('/:id', authenticate, meetingController.update);

/**
 * @route   DELETE /api/v1/meetings/:id
 * @desc    Delete meeting
 * @access  Private
 */
router.delete('/:id', authenticate, meetingController.delete);

/**
 * @route   POST /api/v1/meetings/:id/upload
 * @desc    Upload meeting audio
 * @access  Private
 */
router.post('/:id/upload', authenticate, meetingController.uploadAudio);

/**
 * @route   POST /api/v1/meetings/:id/analyze
 * @desc    Start meeting analysis
 * @access  Private
 */
router.post('/:id/analyze', authenticate, meetingController.startAnalysis);

/**
 * @route   GET /api/v1/meetings/:id/analysis
 * @desc    Get meeting analysis results
 * @access  Private
 */
router.get('/:id/analysis', authenticate, meetingController.getAnalysis);

export default router;