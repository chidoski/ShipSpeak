import { authService } from '@/services/auth.service';
import { PMRole, User, LoginCredentials, SignupCredentials } from '@/types/auth';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('login', () => {
    const validCredentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    beforeEach(() => {
      // Mock existing user
      const mockUser: User = {
        id: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'PM',
        industry: 'enterprise',
        isExecutive: false,
        competencyBaseline: {
          'product-sense': {
            userProblemIdentification: 50,
            frameworkFamiliarity: 45,
            marketContextAwareness: 40,
            score: 45
          },
          communication: {
            executivePresentation: 40,
            answerFirstStructure: 45,
            stakeholderAdaptation: 50,
            score: 45
          },
          'stakeholder-management': {
            multiAudienceExperience: 50,
            conflictResolution: 45,
            crossFunctionalLeadership: 40,
            score: 45
          },
          'technical-translation': {
            complexitySimplification: 45,
            dataPresentationConfidence: 50,
            businessStakeholderCommunication: 55,
            score: 50
          },
          'business-impact': {
            roiCommunication: 35,
            organizationalCommunication: 45,
            visionSetting: 50,
            score: 43
          }
        },
        learningPath: 'practice-first',
        onboardingCompleted: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        lastLoginAt: '2024-01-01T00:00:00.000Z'
      };

      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'shipspeak_all_users') {
          return JSON.stringify([mockUser]);
        }
        return null;
      });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await authService.login(validCredentials);

      expect(response.success).toBe(true);
      expect(response.user).toBeDefined();
      expect(response.user?.email).toBe(validCredentials.email);
      expect(response.token).toBeDefined();
      expect(response.requiresOnboarding).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'shipspeak_token',
        expect.stringContaining('token_')
      );
    });

    it('should fail login with non-existent user', async () => {
      const invalidCredentials: LoginCredentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await authService.login(invalidCredentials);

      expect(response.success).toBe(false);
      expect(response.message).toBe('User not found. Please check your email or sign up.');
      expect(response.user).toBeUndefined();
      expect(response.token).toBeUndefined();
    });

    it('should require onboarding for incomplete users', async () => {
      const incompleteUser: User = {
        id: 'user_456',
        email: 'incomplete@example.com',
        name: 'Incomplete User',
        role: 'Product Owner',
        industry: 'enterprise',
        isExecutive: false,
        competencyBaseline: {} as any,
        learningPath: 'practice-first',
        onboardingCompleted: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        lastLoginAt: '2024-01-01T00:00:00.000Z'
      };

      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'shipspeak_all_users') {
          return JSON.stringify([incompleteUser]);
        }
        return null;
      });

      const credentials: LoginCredentials = {
        email: 'incomplete@example.com',
        password: 'password123'
      };

      const response = await authService.login(credentials);

      expect(response.success).toBe(true);
      expect(response.requiresOnboarding).toBe(true);
    });

    it('should update lastLoginAt on successful login', async () => {
      const response = await authService.login(validCredentials);

      expect(response.success).toBe(true);
      expect(response.user?.lastLoginAt).not.toBe('2024-01-01T00:00:00.000Z');
    });
  });

  describe('signup', () => {
    const validSignupCredentials: SignupCredentials = {
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User',
      role: 'PM'
    };

    it('should create new user successfully', async () => {
      localStorageMock.getItem.mockReturnValue('[]'); // Empty users array

      const response = await authService.signup(validSignupCredentials);

      expect(response.success).toBe(true);
      expect(response.user).toBeDefined();
      expect(response.user?.email).toBe(validSignupCredentials.email);
      expect(response.user?.name).toBe(validSignupCredentials.name);
      expect(response.user?.role).toBe(validSignupCredentials.role);
      expect(response.user?.onboardingCompleted).toBe(false);
      expect(response.requiresOnboarding).toBe(true);
      expect(response.token).toBeDefined();
    });

    it('should identify executive users during signup', async () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const executiveCredentials: SignupCredentials = {
        ...validSignupCredentials,
        role: 'Director'
      };

      const response = await authService.signup(executiveCredentials);

      expect(response.success).toBe(true);
      expect(response.user?.isExecutive).toBe(true);
    });

    it('should fail signup with existing email', async () => {
      const existingUser: User = {
        id: 'user_123',
        email: validSignupCredentials.email,
        name: 'Existing User',
        role: 'PM',
        industry: 'enterprise',
        isExecutive: false,
        competencyBaseline: {} as any,
        learningPath: 'practice-first',
        onboardingCompleted: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        lastLoginAt: '2024-01-01T00:00:00.000Z'
      };

      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'shipspeak_all_users') {
          return JSON.stringify([existingUser]);
        }
        return null;
      });

      const response = await authService.signup(validSignupCredentials);

      expect(response.success).toBe(false);
      expect(response.message).toBe('User already exists with this email address.');
    });

    it('should generate appropriate competency baseline for role', async () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const response = await authService.signup(validSignupCredentials);

      expect(response.success).toBe(true);
      expect(response.user?.competencyBaseline).toBeDefined();
      expect(response.user?.competencyBaseline['product-sense'].score).toBeGreaterThan(0);
      expect(response.user?.competencyBaseline.communication.score).toBeGreaterThan(0);
    });
  });

  describe('logout', () => {
    it('should clear all auth data', async () => {
      await authService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('shipspeak_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('shipspeak_user');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('shipspeak_onboarding');
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when valid data exists', () => {
      const mockUser = { id: 'user_123', email: 'test@example.com' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUser));

      const user = authService.getCurrentUser();

      expect(user).toEqual(mockUser);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('shipspeak_user');
    });

    it('should return null when no user data exists', () => {
      localStorageMock.getItem.mockReturnValue(null);

      const user = authService.getCurrentUser();

      expect(user).toBeNull();
    });

    it('should return null when invalid JSON data exists', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      const user = authService.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when both token and user exist', () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'shipspeak_token') return 'valid_token';
        if (key === 'shipspeak_user') return JSON.stringify({ id: 'user_123' });
        return null;
      });

      const isAuth = authService.isAuthenticated();

      expect(isAuth).toBe(true);
    });

    it('should return false when token is missing', () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'shipspeak_user') return JSON.stringify({ id: 'user_123' });
        return null;
      });

      const isAuth = authService.isAuthenticated();

      expect(isAuth).toBe(false);
    });

    it('should return false when user is missing', () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'shipspeak_token') return 'valid_token';
        return null;
      });

      const isAuth = authService.isAuthenticated();

      expect(isAuth).toBe(false);
    });
  });

  describe('onboarding data management', () => {
    const mockOnboardingData = {
      userId: 'user_123',
      step: 2,
      completedSteps: [1],
      isExecutive: false
    };

    it('should save onboarding data', () => {
      authService.saveOnboardingData(mockOnboardingData);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'shipspeak_onboarding',
        JSON.stringify(mockOnboardingData)
      );
    });

    it('should retrieve onboarding data', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockOnboardingData));

      const data = authService.getOnboardingData();

      expect(data).toEqual(mockOnboardingData);
    });

    it('should merge onboarding data when saving partial updates', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockOnboardingData));

      const partialUpdate = { step: 3, completedSteps: [1, 2] };
      authService.saveOnboardingData(partialUpdate);

      const expectedData = { ...mockOnboardingData, ...partialUpdate };
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'shipspeak_onboarding',
        JSON.stringify(expectedData)
      );
    });
  });

  describe('completeOnboarding', () => {
    const mockUser: User = {
      id: 'user_123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'PM',
      industry: 'enterprise',
      isExecutive: false,
      competencyBaseline: {} as any,
      learningPath: 'practice-first',
      onboardingCompleted: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      lastLoginAt: '2024-01-01T00:00:00.000Z'
    };

    it('should complete onboarding and update user', async () => {
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === 'shipspeak_user') return JSON.stringify(mockUser);
        if (key === 'shipspeak_token') return 'valid_token';
        if (key === 'shipspeak_all_users') return JSON.stringify([mockUser]);
        return null;
      });

      const onboardingData = {
        userId: 'user_123',
        step: 4,
        completedSteps: [1, 2, 3, 4],
        industryContext: { sector: 'fintech' as const },
        competencyBaseline: {} as any,
        recommendedPath: 'meeting-analysis' as const,
        isExecutive: false,
        completedAt: '2024-01-01T00:00:00.000Z'
      };

      const response = await authService.completeOnboarding(onboardingData);

      expect(response.success).toBe(true);
      expect(response.user?.onboardingCompleted).toBe(true);
      expect(response.user?.industry).toBe('fintech');
      expect(response.user?.learningPath).toBe('meeting-analysis');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('shipspeak_onboarding');
    });

    it('should fail when no authenticated user exists', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const onboardingData = {
        userId: 'user_123',
        step: 4,
        completedSteps: [1, 2, 3, 4],
        isExecutive: false,
        completedAt: '2024-01-01T00:00:00.000Z'
      };

      const response = await authService.completeOnboarding(onboardingData);

      expect(response.success).toBe(false);
      expect(response.message).toBe('No authenticated user found');
    });
  });
});