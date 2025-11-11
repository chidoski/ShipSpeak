import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, usePathname } from 'next/navigation';
import AuthProvider, { useAuth } from '@/providers/AuthProvider';
import { authService } from '@/services/auth.service';
import { User } from '@/types/auth';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock auth service
jest.mock('@/services/auth.service', () => ({
  authService: {
    isAuthenticated: jest.fn(),
    getCurrentUser: jest.fn(),
    getOnboardingData: jest.fn(),
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
  },
}));

const mockRouter = {
  replace: jest.fn(),
  push: jest.fn(),
};

// Test component to access auth context
function TestComponent() {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="authenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="user-email">{auth.user?.email || 'null'}</div>
      <div data-testid="error">{auth.error || 'null'}</div>
      <button onClick={() => auth.login({ email: 'test@example.com', password: 'password' })}>
        Login
      </button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  const mockUser: User = {
    id: 'user_123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'PM',
    industry: 'enterprise',
    isExecutive: false,
    competencyBaseline: {} as any,
    learningPath: 'practice-first',
    onboardingCompleted: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    lastLoginAt: '2024-01-01T00:00:00.000Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue('/');
    
    // Default mock returns
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);
    (authService.getCurrentUser as jest.Mock).mockReturnValue(null);
    (authService.getOnboardingData as jest.Mock).mockReturnValue(null);
  });

  it('should provide auth context to children', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      expect(screen.getByTestId('user-email')).toHaveTextContent('null');
    });
  });

  it('should initialize with authenticated user when present', async () => {
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
      expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    });
  });

  it('should handle authentication errors gracefully', async () => {
    (authService.isAuthenticated as jest.Mock).mockImplementation(() => {
      throw new Error('Auth error');
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to initialize authentication');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });
  });

  describe('route protection', () => {
    it('should redirect unauthenticated users from protected routes', async () => {
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/login');
      });
    });

    it('should redirect authenticated users from auth routes to dashboard', async () => {
      (usePathname as jest.Mock).mockReturnValue('/login');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('should redirect incomplete users to onboarding', async () => {
      const incompleteUser = { ...mockUser, onboardingCompleted: false };
      
      (usePathname as jest.Mock).mockReturnValue('/dashboard');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authService.getCurrentUser as jest.Mock).mockReturnValue(incompleteUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/onboarding');
      });
    });

    it('should handle executive redirect from onboarding', async () => {
      const executiveUser = { 
        ...mockUser, 
        isExecutive: true, 
        learningPath: 'executive-fast-track' as const 
      };
      
      (usePathname as jest.Mock).mockReturnValue('/onboarding');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authService.getCurrentUser as jest.Mock).mockReturnValue(executiveUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard?focus=executive');
      });
    });

    it('should handle meeting-analysis path redirect', async () => {
      const analysisUser = { 
        ...mockUser, 
        learningPath: 'meeting-analysis' as const 
      };
      
      (usePathname as jest.Mock).mockReturnValue('/onboarding');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authService.getCurrentUser as jest.Mock).mockReturnValue(analysisUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard?focus=meetings');
      });
    });

    it('should handle practice-first path redirect', async () => {
      const practiceUser = { 
        ...mockUser, 
        learningPath: 'practice-first' as const 
      };
      
      (usePathname as jest.Mock).mockReturnValue('/onboarding');
      (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
      (authService.getCurrentUser as jest.Mock).mockReturnValue(practiceUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/dashboard?focus=practice');
      });
    });
  });

  describe('login functionality', () => {
    it('should handle successful login', async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        success: true,
        user: mockUser,
        token: 'valid_token'
      });

      const { rerender } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      loginButton.click();

      await waitFor(() => {
        expect(authService.login).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password'
        });
      });

      // Mock the updated auth state
      (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
      (authService.getOnboardingData as jest.Mock).mockReturnValue(null);

      rerender(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    it('should handle login failure', async () => {
      (authService.login as jest.Mock).mockResolvedValue({
        success: false,
        message: 'Invalid credentials'
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      loginButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
        expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
      });
    });

    it('should handle login exception', async () => {
      (authService.login as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByText('Login');
      loginButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('An unexpected error occurred');
      });
    });
  });

  describe('logout functionality', () => {
    it('should handle logout', async () => {
      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const logoutButton = screen.getByText('Logout');
      logoutButton.click();

      await waitFor(() => {
        expect(authService.logout).toHaveBeenCalled();
        expect(mockRouter.replace).toHaveBeenCalledWith('/');
      });
    });

    it('should handle logout failure', async () => {
      (authService.logout as jest.Mock).mockRejectedValue(new Error('Logout failed'));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const logoutButton = screen.getByText('Logout');
      logoutButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Failed to logout');
      });
    });
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    consoleSpy.mockRestore();
  });
});