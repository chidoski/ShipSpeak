import { Request, Response } from 'express';
import { userService } from './user.controller';
import { PasswordService } from '../utils/password';
import { JWTService } from '../utils/jwt';
import { ApiError, ApiErrorCode, ApiResponse, ApiRequest } from '../types/api';
import { ValidationService } from '../types/validation';
import { UserRole } from '../types/auth';
import { asyncHandler } from '../middleware/error';

const passwordService = new PasswordService();
const jwtService = new JWTService();

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validationErrors = ValidationService.validateRegisterRequest(req.body);
    if (validationErrors.length > 0) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: `Validation failed: ${validationErrors.map(e => e.message).join(', ')}`,
        details: { errors: validationErrors }
      });
    }

    const { email, password, firstName, lastName, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      throw new ApiError({
        code: ApiErrorCode.CONFLICT,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await passwordService.hashPassword(password);

    // Map role string to enum
    const userRole = role.toUpperCase() as keyof typeof UserRole;
    const mappedRole = UserRole[userRole] || UserRole.USER;

    // Create user
    const userData = {
      email,
      passwordHash,
      firstName,
      lastName,
      role: mappedRole
    };

    const user = await userService.create(userData);

    // Generate JWT token
    const token = jwtService.generateToken(user);

    // Remove password hash from response
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    const response: ApiResponse = {
      success: true,
      data: {
        user: userResponse,
        token
      },
      meta: {
        requestId: (req as any).requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - ((req as any).startTime || Date.now())
      }
    };

    res.status(201).json(response);
  });

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const validationErrors = ValidationService.validateLoginRequest(req.body);
    if (validationErrors.length > 0) {
      throw new ApiError({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: `Validation failed: ${validationErrors.map(e => e.message).join(', ')}`,
        details: { errors: validationErrors }
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await passwordService.verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwtService.generateToken(user);

    // Remove password hash from response
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    const response: ApiResponse = {
      success: true,
      data: {
        user: userResponse,
        token
      },
      meta: {
        requestId: (req as any).requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - ((req as any).startTime || Date.now())
      }
    };

    res.status(200).json(response);
  });

  refresh = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    // Verify user still exists and is active
    const user = await userService.findById(apiReq.user.id);
    if (!user || !user.isActive) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'User account is no longer active'
      });
    }

    // Generate new JWT token
    const token = jwtService.generateToken(user);

    const response: ApiResponse = {
      success: true,
      data: {
        token
      },
      meta: {
        requestId: (req as any).requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - ((req as any).startTime || Date.now())
      }
    };

    res.status(200).json(response);
  });

  me = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const apiReq = req as ApiRequest;
    if (!apiReq.user) {
      throw new ApiError({
        code: ApiErrorCode.UNAUTHORIZED,
        message: 'Authentication required'
      });
    }

    // Remove password hash from response
    const userResponse = {
      id: apiReq.user.id,
      email: apiReq.user.email,
      firstName: apiReq.user.firstName,
      lastName: apiReq.user.lastName,
      role: apiReq.user.role,
      isActive: apiReq.user.isActive,
      isEmailVerified: apiReq.user.isEmailVerified,
      company: apiReq.user.company,
      position: apiReq.user.position,
      experienceLevel: apiReq.user.experienceLevel,
      preferences: apiReq.user.preferences,
      createdAt: apiReq.user.createdAt,
      updatedAt: apiReq.user.updatedAt,
      lastLoginAt: apiReq.user.lastLoginAt
    };

    const response: ApiResponse = {
      success: true,
      data: {
        user: userResponse
      },
      meta: {
        requestId: (req as any).requestId,
        timestamp: new Date().toISOString(),
        version: process.env.API_VERSION || '1.0.0',
        processingTime: Date.now() - ((req as any).startTime || Date.now())
      }
    };

    res.status(200).json(response);
  });
}

export const authController = new AuthController();