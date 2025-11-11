import { 
  User, 
  LoginCredentials, 
  SignupCredentials, 
  AuthResponse, 
  OnboardingData,
  CompetencyBaseline,
  PMRole 
} from '@/types/auth';

class AuthService {
  private readonly STORAGE_KEYS = {
    USER: 'shipspeak_user',
    TOKEN: 'shipspeak_token',
    ONBOARDING: 'shipspeak_onboarding'
  };

  private generateUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock validation - in real app this would hit an API
    const users = this.getAllUsers();
    const user = users.find(u => u.email === credentials.email);

    if (!user) {
      return {
        success: false,
        message: 'User not found. Please check your email or sign up.'
      };
    }

    // Update last login
    user.lastLoginAt = new Date().toISOString();
    this.updateUser(user);

    const token = this.generateToken();
    localStorage.setItem(this.STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));

    return {
      success: true,
      user,
      token,
      requiresOnboarding: !user.onboardingCompleted
    };
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const users = this.getAllUsers();
    const existingUser = users.find(u => u.email === credentials.email);

    if (existingUser) {
      return {
        success: false,
        message: 'User already exists with this email address.'
      };
    }

    // Create new user
    const userId = this.generateUserId();
    const isExecutive = ['Director', 'VP Product', 'CPO'].includes(credentials.role);
    
    const user: User = {
      id: userId,
      email: credentials.email,
      name: credentials.name,
      role: credentials.role,
      industry: 'enterprise', // Default, will be set in onboarding
      isExecutive,
      competencyBaseline: this.getDefaultCompetencyBaseline(credentials.role),
      learningPath: 'practice-first', // Default, will be determined in onboarding
      onboardingCompleted: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    // Save user
    users.push(user);
    localStorage.setItem('shipspeak_all_users', JSON.stringify(users));

    // Generate token
    const token = this.generateToken();
    localStorage.setItem(this.STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));

    return {
      success: true,
      user,
      token,
      requiresOnboarding: true
    };
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(this.STORAGE_KEYS.USER);
    localStorage.removeItem(this.STORAGE_KEYS.ONBOARDING);
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.STORAGE_KEYS.USER);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null && this.getCurrentUser() !== null;
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
    const user = this.getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: 'No authenticated user found'
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

    this.updateUser(updatedUser);
    localStorage.removeItem(this.STORAGE_KEYS.ONBOARDING);

    return {
      success: true,
      user: updatedUser,
      token: this.getToken()
    };
  }

  private getAllUsers(): User[] {
    const usersStr = localStorage.getItem('shipspeak_all_users');
    if (!usersStr) return [];
    
    try {
      return JSON.parse(usersStr);
    } catch {
      return [];
    }
  }

  private updateUser(user: User): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === user.id);
    
    if (index >= 0) {
      users[index] = user;
      localStorage.setItem('shipspeak_all_users', JSON.stringify(users));
    }
    
    localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
  }
}

export const authService = new AuthService();