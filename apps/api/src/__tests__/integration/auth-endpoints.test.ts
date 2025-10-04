import request from 'supertest';
import app from '../../index';
import { userService } from '../../controllers/user.controller';
import { PasswordService } from '../../utils/password';
import { User, UserRole } from '../../types/auth';

// Mock user service
jest.mock('../../controllers/user.controller');
const mockUserService = userService as jest.Mocked<typeof userService>;

describe('Authentication Endpoints', () => {
  const passwordService = new PasswordService();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
        firstName: 'John',
        lastName: 'Doe',
        role: 'product_manager'
      };

      const hashedPassword = await passwordService.hashPassword(userData.password);
      const mockUser: User = {
        id: 'user-123',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: UserRole.PRODUCT_MANAGER,
        passwordHash: hashedPassword,
        isActive: true,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          user: {
            id: 'user-123',
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: 'product_manager',
            isActive: true,
            isEmailVerified: false
          },
          token: expect.any(String)
        }
      });

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserService.create).toHaveBeenCalledWith({
        email: userData.email,
        passwordHash: expect.any(String),
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: UserRole.PRODUCT_MANAGER
      });
    });

    it('should reject registration with existing email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'SecurePass123!',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'user'
      };

      const existingUser: User = {
        id: 'existing-user',
        email: userData.email,
        firstName: 'Existing',
        lastName: 'User',
        role: UserRole.USER,
        passwordHash: 'existing-hash',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserService.findByEmail.mockResolvedValue(existingUser);

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'User with this email already exists'
        }
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: '123' // too short
        })
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: expect.stringContaining('Validation failed')
        }
      });
    });

    it('should enforce password complexity', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'weak',
          firstName: 'John',
          lastName: 'Doe'
        })
        .expect(400);

      expect(response.body.error.message).toContain('Password must be at least 8 characters');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'SecurePass123!'
      };

      const hashedPassword = await passwordService.hashPassword(loginData.password);
      const mockUser: User = {
        id: 'user-123',
        email: loginData.email,
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.PRODUCT_MANAGER,
        passwordHash: hashedPassword,
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          user: {
            id: 'user-123',
            email: loginData.email,
            firstName: 'John',
            lastName: 'Doe',
            role: 'product_manager'
          },
          token: expect.any(String)
        }
      });
    });

    it('should reject login with non-existent email', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password'
        }
      });
    });

    it('should reject login with incorrect password', async () => {
      const hashedPassword = await passwordService.hashPassword('correctpassword');
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
        passwordHash: hashedPassword,
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid email or password'
        }
      });
    });

    it('should reject login for inactive user', async () => {
      const hashedPassword = await passwordService.hashPassword('password123');
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
        passwordHash: hashedPassword,
        isActive: false,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserService.findByEmail.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Account is deactivated'
        }
      });
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh token with valid token', async () => {
      // First, create a valid user and token
      const password = 'password123';
      const hashedPassword = await passwordService.hashPassword(password);
      
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.PRODUCT_MANAGER,
        passwordHash: hashedPassword,
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserService.findById.mockResolvedValue(mockUser);

      // Login to get a token
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: password
        });

      const token = loginResponse.body.data.token;

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          token: expect.any(String)
        }
      });

      // Token should be a valid JWT string
      expect(response.body.data.token).toMatch(/^eyJ[\w-]*\.[\w-]*\.[\w-]*$/);
    });

    it('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: expect.stringContaining('Invalid token')
        }
      });
    });

    it('should reject refresh with missing authorization header', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authorization header required'
        }
      });
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user profile', async () => {
      const password = 'password123';
      const hashedPassword = await passwordService.hashPassword(password);
      
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.PRODUCT_MANAGER,
        passwordHash: hashedPassword,
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserService.findById.mockResolvedValue(mockUser);
      mockUserService.findByEmail.mockResolvedValue(mockUser);

      // Login to get a token
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: password
        });

      const token = loginResponse.body.data.token;

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          user: {
            id: 'user-123',
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'product_manager',
            isActive: true,
            isEmailVerified: true
          }
        }
      });
    });

    it('should reject unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authorization header required'
        }
      });
    });
  });
});