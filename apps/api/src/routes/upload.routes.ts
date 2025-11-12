import { Router } from 'express';
import multer from 'multer';
import { uploadController } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth';
import { rateLimitConfig } from '../middleware/rate-limiting';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'audio/mp3',
      'audio/wav',
      'audio/mpeg',
      'audio/m4a',
      'audio/webm'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

/**
 * @route   POST /api/v1/upload/initiate
 * @desc    Initiate chunked upload session
 * @access  Private
 */
router.post('/initiate', 
  authenticate, 
  rateLimitConfig.upload,
  uploadController.initiateChunkedUpload
);

/**
 * @route   POST /api/v1/upload/chunk
 * @desc    Upload file chunk
 * @access  Private
 */
router.post('/chunk', 
  authenticate, 
  rateLimitConfig.upload,
  uploadController.uploadChunk
);

/**
 * @route   POST /api/v1/upload/complete
 * @desc    Complete chunked upload
 * @access  Private
 */
router.post('/complete', 
  authenticate, 
  rateLimitConfig.upload,
  uploadController.completeUpload
);

/**
 * @route   GET /api/v1/upload/progress/:sessionId
 * @desc    Get upload progress
 * @access  Private
 */
router.get('/progress/:sessionId', 
  authenticate, 
  uploadController.getUploadProgress
);

/**
 * @route   POST /api/v1/upload/validate
 * @desc    Validate file before upload
 * @access  Private
 */
router.post('/validate', 
  authenticate, 
  upload.single('file'),
  uploadController.validateFile
);

/**
 * @route   POST /api/v1/upload/simple
 * @desc    Simple file upload (for smaller files)
 * @access  Private
 */
router.post('/simple', 
  authenticate, 
  rateLimitConfig.upload,
  upload.single('audio'),
  uploadController.simpleUpload
);

/**
 * @route   DELETE /api/v1/upload/session/:sessionId
 * @desc    Cancel upload session
 * @access  Private
 */
router.delete('/session/:sessionId', 
  authenticate, 
  uploadController.cancelUploadSession
);

export default router;