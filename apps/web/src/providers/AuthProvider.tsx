'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthState, User, LoginCredentials, SignupCredentials } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string; requiresOnboarding?: boolean }>;
  signup: (credentials: SignupCredentials) => Promise<{ success: boolean; message?: string; requiresOnboarding?: boolean }>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
    onboardingData: null
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    // Handle route protection and intelligent redirects
    if (!authState.loading) {
      handleRouteProtection();
    }
  }, [authState.loading, authState.isAuthenticated, authState.user, pathname]);

  const initializeAuth = () => {
    try {
      const isAuthenticated = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      const onboardingData = authService.getOnboardingData();

      setAuthState({
        isAuthenticated,
        user,
        loading: false,
        error: null,
        onboardingData
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Failed to initialize authentication',
        onboardingData: null
      });
    }
  };

  const handleRouteProtection = () => {
    const { isAuthenticated, user } = authState;
    const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/signup');
    const isOnboardingRoute = pathname?.startsWith('/onboarding');
    const isProtectedRoute = pathname?.startsWith('/dashboard') || 
                            pathname?.startsWith('/meetings') ||
                            pathname?.startsWith('/practice') ||
                            pathname?.startsWith('/progress') ||
                            pathname?.startsWith('/settings');

    // If not authenticated and accessing protected routes
    if (!isAuthenticated && isProtectedRoute) {
      router.replace('/login');
      return;
    }

    // If authenticated but on auth routes
    if (isAuthenticated && isAuthRoute) {
      if (user && !user.onboardingCompleted) {
        router.replace('/onboarding');
      } else {
        router.replace('/dashboard');
      }
      return;
    }

    // If authenticated but onboarding not completed
    if (isAuthenticated && user && !user.onboardingCompleted && !isOnboardingRoute) {
      router.replace('/onboarding');
      return;
    }

    // If authenticated, onboarding completed, but on onboarding route
    if (isAuthenticated && user && user.onboardingCompleted && isOnboardingRoute) {
      // Intelligent redirect based on user's learning path
      const redirectPath = getIntelligentRedirect(user);
      router.replace(redirectPath);
      return;
    }
  };

  const getIntelligentRedirect = (user: User): string => {
    // Redirect based on learning path and role
    const { learningPath, role, isExecutive } = user;

    if (learningPath === 'executive-fast-track' || isExecutive) {
      return '/dashboard?focus=executive';
    }
    
    if (learningPath === 'meeting-analysis') {
      return '/dashboard?focus=meetings';
    }
    
    if (learningPath === 'practice-first') {
      return '/dashboard?focus=practice';
    }

    // Default based on role
    if (['Director', 'VP Product', 'CPO'].includes(role)) {
      return '/dashboard?focus=executive';
    }

    return '/dashboard';
  };

  const login = async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.user) {
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null,
          onboardingData: authService.getOnboardingData()
        });
        
        return {
          success: true,
          requiresOnboarding: response.requiresOnboarding
        };
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: response.message || 'Login failed'
        }));
        
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.signup(credentials);
      
      if (response.success && response.user) {
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          loading: false,
          error: null,
          onboardingData: authService.getOnboardingData()
        });
        
        return {
          success: true,
          requiresOnboarding: response.requiresOnboarding
        };
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: response.message || 'Signup failed'
        }));
        
        return {
          success: false,
          message: response.message
        };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        onboardingData: null
      });
      
      router.replace('/');
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to logout'
      }));
    }
  };

  const refreshUser = () => {
    const user = authService.getCurrentUser();
    const onboardingData = authService.getOnboardingData();
    
    setAuthState(prev => ({
      ...prev,
      user,
      onboardingData
    }));
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
    refreshUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}