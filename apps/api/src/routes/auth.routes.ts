import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authRateLimit } from '../middleware/rate-limiting';
import { 
  validateRegister, 
  validateLogin, 
  handleValidationErrors 
} from '../middleware/validation';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register', 
  authRateLimit,
  validateRegister,
  handleValidationErrors,
  authController.register
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login', 
  authRateLimit,
  validateLogin,
  handleValidationErrors,
  authController.login
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh JWT token
 * @access  Private
 */
router.post(
  '/refresh', 
  authRateLimit,
  authenticate, 
  authController.refresh
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me', 
  authenticate, 
  authController.me
);

export default router;