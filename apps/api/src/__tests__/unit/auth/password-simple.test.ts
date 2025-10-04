import { PasswordService } from '../../../utils/password';

describe('PasswordService', () => {
  let passwordService: PasswordService;

  beforeEach(() => {
    passwordService = new PasswordService();
  });

  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await passwordService.hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
      expect(hashedPassword.startsWith('$2')).toBe(true);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await passwordService.hashPassword(password);
      const hash2 = await passwordService.hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await passwordService.hashPassword(password);
      
      const isValid = await passwordService.verifyPassword(password, hashedPassword);
      
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hashedPassword = await passwordService.hashPassword(password);
      
      const isValid = await passwordService.verifyPassword(wrongPassword, hashedPassword);
      
      expect(isValid).toBe(false);
    });

    it('should reject empty password', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await passwordService.hashPassword(password);
      
      const isValid = await passwordService.verifyPassword('', hashedPassword);
      
      expect(isValid).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong password', () => {
      const result = passwordService.validatePasswordStrength('TestPassword123!');
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password too short', () => {
      const result = passwordService.validatePasswordStrength('Test1!');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase', () => {
      const result = passwordService.validatePasswordStrength('testpassword123!');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without number', () => {
      const result = passwordService.validatePasswordStrength('TestPassword!');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject common passwords', () => {
      const result = passwordService.validatePasswordStrength('password123');
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is too common');
    });
  });
});