import { 
  User, 
  LoginCredentials, 
  SignupCredentials, 
  AuthResponse, 
  OnboardingData,
  CompetencyBaseline,
  PMRole 
} from '@/types/auth';
import { createClient } from '@/lib/supabase/client';

class AuthService {
  private supabase = createClient();
  private readonly STORAGE_KEYS = {
    ONBOARDING: 'shipspeak_onboarding'
  };

  private mapDbRoleToUserRole(dbRole: string | null): PMRole {
    const roleMap: Record<string, PMRole> = {
      'ic_pm': 'PM',
      'senior_pm': 'Senior PM',
      'staff_pm': 'Staff PM',
      'principal_pm': 'Principal PM',
      'director': 'Director',
      'vp': 'VP Product',
      'po_transitioning': 'Product Owner'
    };

    return roleMap[dbRole || ''] || 'PM';
  }

  private mapUserRoleToDbRole(userRole: PMRole): string {
    const roleMap: Record<PMRole, string> = {
      'PM': 'ic_pm',
      'Senior PM': 'senior_pm',
      'Staff PM': 'staff_pm',
      'Principal PM': 'principal_pm',
      'Director': 'director',
      'VP Product': 'vp',
      'CPO': 'vp', // Map CPO to vp in database
      'Group PM': 'principal_pm', // Map Group PM to principal
      'Product Owner': 'po_transitioning'
    };

    return roleMap[userRole] || 'ic_pm';
  }

  private getDefaultCompetencyBaseline(role: PMRole): CompetencyBaseline {
    const isExecutive = ['Director', 'VP Product', 'CPO'].includes(role);
    const experience = role === 'Product Owner' ? 20 : 
                     role === 'PM' ? 35 :
                     role === 'Senior PM' ? 50 :
                     role === 'Group PM' ? 65 :
                     role === 'Director' ? 75 :
                     role === 'VP Product' ? 85 : 90;

    return {
      'product-sense': {
        userProblemIdentification: experience,
        frameworkFamiliarity: experience - 5,
        marketContextAwareness: experience - 10,
        score: experience
      },
      communication: {
        executivePresentation: isExecutive ? experience : experience - 20,
        answerFirstStructure: isExecutive ? experience : experience - 15,
        stakeholderAdaptation: experience - 5,
        score: isExecutive ? experience : experience - 10
      },
      'stakeholder-management': {
        multiAudienceExperience: experience,
        conflictResolution: experience - 5,
        crossFunctionalLeadership: experience - 10,
        score: experience - 5
      },
      'technical-translation': {
        complexitySimplification: experience - 10,
        dataPresentationConfidence: experience - 5,
        businessStakeholderCommunication: experience,
        score: experience - 5
      },
      'business-impact': {
        roiCommunication: isExecutive ? experience : experience - 15,
        organizationalCommunication: isExecutive ? experience : experience - 25,
        visionSetting: isExecutive ? experience : experience - 30,
        score: isExecutive ? experience : experience - 20
      }
    };
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      if (data.user) {
        // Get user profile from database
        const user = await this.getUserProfile(data.user.id);
        
        return {
          success: true,
          user,
          token: data.session?.access_token,
          requiresOnboarding: !user?.onboardingCompleted
        };
      }

      return {
        success: false,
        message: 'Login failed'
      };
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            role: credentials.role
          }
        }
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      if (data.user) {
        // Create user profile in database
        const user = await this.createUserProfile(data.user.id, credentials);
        
        return {
          success: true,
          user,
          token: data.session?.access_token,
          requiresOnboarding: true
        };
      }

      return {
        success: false,
        message: 'Signup failed'
      };
    } catch (error) {
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    localStorage.removeItem(this.STORAGE_KEYS.ONBOARDING);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      if (!user) return null;
      
      return await this.getUserProfile(user.id);
    } catch {
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      return session?.access_token || null;
    } catch {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      return !!session;
    } catch {
      return false;
    }
  }

  saveOnboardingData(data: Partial<OnboardingData>): void {
    const existingData = this.getOnboardingData();
    const updatedData = { ...existingData, ...data };
    localStorage.setItem(this.STORAGE_KEYS.ONBOARDING, JSON.stringify(updatedData));
  }

  getOnboardingData(): OnboardingData | null {
    const dataStr = localStorage.getItem(this.STORAGE_KEYS.ONBOARDING);
    if (!dataStr) return null;
    
    try {
      return JSON.parse(dataStr);
    } catch {
      return null;
    }
  }

  async completeOnboarding(data: OnboardingData): Promise<AuthResponse> {
    try {
      const { data: { user: authUser } } = await this.supabase.auth.getUser();
      if (!authUser) {
        return {
          success: false,
          message: 'No authenticated user found'
        };
      }

      const user = await this.getUserProfile(authUser.id);
      if (!user) {
        return {
          success: false,
          message: 'User profile not found'
        };
      }

      // Update user with onboarding data
      const updatedUser: User = {
        ...user,
        industry: data.industryContext?.sector || 'enterprise',
        competencyBaseline: data.competencyBaseline || user.competencyBaseline,
        learningPath: data.recommendedPath || 'practice-first',
        onboardingCompleted: true
      };

      // Update profile in database with onboarding completion
      await this.updateUserProfile(updatedUser);
      
      // Also mark onboarding as completed in the database
      await this.supabase
        .from('profiles')
        .update({ 
          industry: updatedUser.industry,
          // Add onboarding completed flag if we add it to schema later
        })
        .eq('id', authUser.id);
      
      localStorage.removeItem(this.STORAGE_KEYS.ONBOARDING);

      return {
        success: true,
        user: updatedUser,
        token: (await this.supabase.auth.getSession()).data.session?.access_token
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to complete onboarding'
      };
    }
  }

  private async getUserProfile(userId: string): Promise<User | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      // Map database fields to User type
      const role = this.mapDbRoleToUserRole(data.current_role);
      const isExecutive = ['Director', 'VP Product', 'CPO'].includes(role);

      return {
        id: data.id,
        email: data.email,
        name: data.full_name || data.email,
        role,
        industry: data.industry || 'enterprise',
        isExecutive,
        competencyBaseline: this.getDefaultCompetencyBaseline(role),
        learningPath: 'practice-first', // TODO: Add to database schema
        onboardingCompleted: data.current_role !== null, // User has completed onboarding if they have a role
        createdAt: data.created_at,
        lastLoginAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  private async createUserProfile(userId: string, credentials: SignupCredentials): Promise<User> {
    try {
      const isExecutive = ['Director', 'VP Product', 'CPO'].includes(credentials.role);
      const dbRole = this.mapUserRoleToDbRole(credentials.role);

      // Insert user profile into database
      const { error } = await this.supabase
        .from('profiles')
        .insert({
          id: userId,
          email: credentials.email,
          full_name: credentials.name,
          current_role: dbRole,
          industry: 'enterprise' // Default industry, will be set during onboarding
        });

      if (error) {
        console.error('Error creating user profile:', error);
        throw new Error('Failed to create user profile');
      }

      const user: User = {
        id: userId,
        email: credentials.email,
        name: credentials.name,
        role: credentials.role,
        industry: 'enterprise',
        isExecutive,
        competencyBaseline: this.getDefaultCompetencyBaseline(credentials.role),
        learningPath: 'practice-first',
        onboardingCompleted: false, // New users need onboarding
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      return user;
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      // Return a fallback user if database insert fails
      return {
        id: userId,
        email: credentials.email,
        name: credentials.name,
        role: credentials.role,
        industry: 'enterprise',
        isExecutive: ['Director', 'VP Product', 'CPO'].includes(credentials.role),
        competencyBaseline: this.getDefaultCompetencyBaseline(credentials.role),
        learningPath: 'practice-first',
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
    }
  }

  private async updateUserProfile(user: User): Promise<void> {
    try {
      const dbRole = this.mapUserRoleToDbRole(user.role);
      
      const { error } = await this.supabase
        .from('profiles')
        .update({
          full_name: user.name,
          current_role: dbRole,
          industry: user.industry
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update user profile');
      }
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      // Don't throw to avoid breaking the flow
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send reset email'
      };
    }
  }

  async updatePassword(password: string): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password
      });

      if (error) {
        return {
          success: false,
          message: error.message
        };
      }

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update password'
      };
    }
  }
}

export const authService = new AuthService();