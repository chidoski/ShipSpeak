import { Response, NextFunction } from 'express';
import { authenticate, authorize, optionalAuth } from '../../../middleware/auth';
import { UserRole, User } from '../../../types/auth';
import { ApiErrorCode, ApiRequest } from '../../../types/api';
import { jwtService } from '../../../utils/jwt';
import { userService } from '../../../controllers/user.controller';

jest.mock('../../../utils/jwt');
jest.mock('../../../controllers/user.controller');

describe('Auth Middleware', () => {
  let mockRequest: Partial<ApiRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockUser: User;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      user: undefined,
      tokenPayload: undefined
    } as Partial<ApiRequest>;
    mockResponse = {};
    mockNext = jest.fn();

    mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.PRODUCT_MANAGER,
      passwordHash: 'hashed-password',
      isActive: true,
      isEmailVerified: true,
      experienceLevel: 'senior' as any,
      preferences: {
        communicationStyle: 'direct',
        focusAreas: ['influence'],
        meetingTypes: ['1:1'],
        notificationSettings: {
          email: true,
          inApp: true,
          analysisComplete: true,
          practiceReminders: true,
          weeklyReports: false
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate valid token successfully', async () => {
      const mockToken = 'valid-token';
      const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.PRODUCT_MANAGER,
        iat: Date.now(),
        exp: Date.now() + 3600
      };

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`
      };

      (jwtService.verifyToken as jest.Mock).mockReturnValue(mockPayload);
      (userService.findById as jest.Mock).mockResolvedValue(mockUser);

      await authenticate(
        mockRequest as ApiRequest,
        mockResponse as Response,
        mockNext
      );

      expect(jwtService.verifyToken).toHaveBeenCalledWith(mockToken);
      expect(userService.findById).toHaveBeenCalledWith(mockPayload.userId);
      expect(mockRequest.user).toBe(mockUser);
      expect(mockRequest.tokenPayload).toBe(mockPayload);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should reject request without authorization header', async () => {
      await authenticate(
        mockRequest as ApiRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          code: ApiErrorCode.AUTHENTICATION_ERROR,
          message: 'No valid authorization header provided'
        })
      );
    });
  });

  describe('authorize', () => {
    it('should authorize user with correct role', () => {
      (mockRequest as ApiRequest).user = mockUser;

      const middleware = authorize(UserRole.PRODUCT_MANAGER, UserRole.ADMIN);
      middleware(
        mockRequest as ApiRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should reject user with insufficient permissions', () => {
      (mockRequest as ApiRequest).user = mockUser;

      const middleware = authorize(UserRole.ADMIN);
      middleware(
        mockRequest as ApiRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          code: ApiErrorCode.AUTHORIZATION_ERROR,
          message: 'Insufficient permissions'
        })
      );
    });
  });

  describe('optionalAuth', () => {
    it('should set user if valid token provided', async () => {
      const mockToken = 'valid-token';
      const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.PRODUCT_MANAGER,
        iat: Date.now(),
        exp: Date.now() + 3600
      };

      mockRequest.headers = {
        authorization: `Bearer ${mockToken}`
      };

      (jwtService.verifyToken as jest.Mock).mockReturnValue(mockPayload);
      (userService.findById as jest.Mock).mockResolvedValue(mockUser);

      await optionalAuth(
        mockRequest as ApiRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.user).toBe(mockUser);
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should continue without user if no token provided', async () => {
      await optionalAuth(
        mockRequest as ApiRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockRequest.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});