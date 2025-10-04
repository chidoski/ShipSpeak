import { JWTService } from '../../../utils/jwt';
import { User, UserRole } from '../../../types/auth';

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
  });
});