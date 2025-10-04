import { JWTService } from '@/utils/jwt';
import { User, UserRole } from '@/types/auth';

describe('JWTService', () => {
  let jwtService: JWTService;
  let mockUser: User;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_EXPIRY = '15m';
    process.env.JWT_REFRESH_EXPIRY = '7d';
    
    jwtService = new JWTService();
    
    mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: UserRole.PRODUCT_MANAGER,
      profile: {
        firstName: 'John',
        lastName: 'Doe',
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
        }
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    };
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
  });

  describe('constructor', () => {
    it('should throw error if JWT_SECRET is not set in production', () => {
      delete process.env.JWT_SECRET;
      process.env.NODE_ENV = 'production';
      
      expect(() => new JWTService()).toThrow('JWT_SECRET must be set in production');
      
      process.env.NODE_ENV = 'test';
    });

    it('should use fallback secret in non-production environments', () => {
      delete process.env.JWT_SECRET;
      process.env.NODE_ENV = 'development';
      
      expect(() => new JWTService()).not.toThrow();
      
      process.env.NODE_ENV = 'test';
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = jwtService.generateToken(mockUser);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include correct payload in token', () => {
      const token = jwtService.generateToken(mockUser);
      const payload = jwtService.verifyToken(token);
      
      expect(payload.userId).toBe(mockUser.id);
      expect(payload.email).toBe(mockUser.email);
      expect(payload.role).toBe(mockUser.role);
      expect(payload.iat).toBeDefined();
      expect(payload.exp).toBeDefined();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const refreshToken = jwtService.generateRefreshToken(mockUser);
      
      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe('string');
      expect(refreshToken.split('.')).toHaveLength(3);
    });

    it('should verify refresh token correctly', () => {
      const refreshToken = jwtService.generateRefreshToken(mockUser);
      const payload = jwtService.verifyRefreshToken(refreshToken);
      
      expect(payload.userId).toBe(mockUser.id);
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token successfully', () => {
      const token = jwtService.generateToken(mockUser);
      const payload = jwtService.verifyToken(token);
      
      expect(payload.userId).toBe(mockUser.id);
      expect(payload.email).toBe(mockUser.email);
      expect(payload.role).toBe(mockUser.role);
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        jwtService.verifyToken('invalid-token');
      }).toThrow();
    });

    it('should throw error for expired token', () => {
      jest.useFakeTimers();
      
      const token = jwtService.generateToken(mockUser);
      
      jest.advanceTimersByTime(16 * 60 * 1000);
      
      expect(() => {
        jwtService.verifyToken(token);
      }).toThrow();
      
      jest.useRealTimers();
    });

    it('should throw error for malformed token', () => {
      expect(() => {
        jwtService.verifyToken('malformed.token');
      }).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify valid refresh token successfully', () => {
      const refreshToken = jwtService.generateRefreshToken(mockUser);
      const payload = jwtService.verifyRefreshToken(refreshToken);
      
      expect(payload.userId).toBe(mockUser.id);
    });

    it('should throw error for invalid refresh token type', () => {
      const accessToken = jwtService.generateToken(mockUser);
      
      expect(() => {
        jwtService.verifyRefreshToken(accessToken);
      }).toThrow();
    });

    it('should throw error for expired refresh token', () => {
      jest.useFakeTimers();
      
      const refreshToken = jwtService.generateRefreshToken(mockUser);
      
      jest.advanceTimersByTime(8 * 24 * 60 * 60 * 1000);
      
      expect(() => {
        jwtService.verifyRefreshToken(refreshToken);
      }).toThrow();
      
      jest.useRealTimers();
    });
  });

  describe('getTokenExpiration', () => {
    it('should return correct expiration date', () => {
      const before = Date.now();
      const expiration = jwtService.getTokenExpiration();
      const after = Date.now();
      
      const expectedMin = before + (15 * 60 * 1000);
      const expectedMax = after + (15 * 60 * 1000);
      
      expect(expiration.getTime()).toBeGreaterThanOrEqual(expectedMin);
      expect(expiration.getTime()).toBeLessThanOrEqual(expectedMax);
    });
  });
});