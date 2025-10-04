export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  passwordHash: string;
  isActive: boolean;
  isEmailVerified: boolean;
  company?: string;
  position?: string;
  experienceLevel?: ExperienceLevel;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  PRODUCT_MANAGER = 'product_manager',
  EXECUTIVE = 'executive',
  TEAM_LEAD = 'team_lead',
  USER = 'user'
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  company?: string;
  position?: string;
  experienceLevel: ExperienceLevel;
  preferences: UserPreferences;
}

export enum ExperienceLevel {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  PRINCIPAL = 'principal',
  EXECUTIVE = 'executive'
}

export interface UserPreferences {
  communicationStyle: 'direct' | 'collaborative' | 'diplomatic';
  focusAreas: string[];
  meetingTypes: string[];
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  inApp: boolean;
  analysisComplete: boolean;
  practiceReminders: boolean;
  weeklyReports: boolean;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: User;
  tokenPayload?: JWTPayload;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  profile: Omit<UserProfile, 'preferences'>;
  preferences?: Partial<UserPreferences>;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface PermissionCheck {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'admin';
  resourceId?: string;
}

export interface RolePermissions {
  [UserRole.ADMIN]: string[];
  [UserRole.PRODUCT_MANAGER]: string[];
  [UserRole.EXECUTIVE]: string[];
  [UserRole.TEAM_LEAD]: string[];
  [UserRole.USER]: string[];
}