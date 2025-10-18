# Authentication Architecture: Supabase + Stack Auth Integration
## Unified Auth Strategy for ShipSpeak

**Version:** 2.0  
**Date:** October 16, 2025  
**Status:** Updated Architecture  
**Decision:** Supabase Auth + Stack Auth for comprehensive authentication  

---

## Executive Summary

This document outlines the updated authentication architecture leveraging **Supabase Auth** (already integrated in Epic 1) and **Stack Auth** for additional enterprise features. This approach provides a unified, secure, and feature-rich authentication system while maintaining consistency with our existing Supabase infrastructure.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Next.js Frontend                       │
├─────────────────────────────────────────────────────────┤
│                  Stack Auth Client                       │
│         (Social Login UI + Session Management)           │
├─────────────────────────────────────────────────────────┤
│                  Supabase Auth Client                    │
│            (Core Auth + Database Integration)            │
└─────────────────────────────────────────────────────────┘
                            ↕
                    [HTTPS/WebSocket]
                            ↕
┌─────────────────────────────────────────────────────────┐
│                   Authentication Layer                    │
├─────────────────────────────────────────────────────────┤
│  Stack Auth          │          Supabase Auth           │
│  - Social Providers  │  - User Management               │
│  - MFA/2FA          │  - Row Level Security             │
│  - Team Management  │  - Database Integration          │
│  - SSO/SAML        │  - Real-time Subscriptions       │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL (via Supabase)                   │
│                 - Users & Profiles                       │
│                 - Sessions & Tokens                      │
│                 - Audit Logs                            │
└─────────────────────────────────────────────────────────┘
```

---

## 1. Supabase Auth Configuration

### Enhanced Supabase Auth Setup

```typescript
// lib/auth/supabase-auth.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Supabase client with auth enhancements
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce', // Most secure flow
      storage: {
        // Custom storage for enhanced security
        getItem: (key) => {
          if (typeof window !== 'undefined') {
            return window.sessionStorage.getItem(key);
          }
          return null;
        },
        setItem: (key, value) => {
          if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(key, value);
          }
        },
        removeItem: (key) => {
          if (typeof window !== 'undefined') {
            window.sessionStorage.removeItem(key);
          }
        },
      },
    },
    global: {
      headers: {
        'x-application-name': 'shipspeak-web',
      },
    },
  }
);

// Supabase Auth Methods
export const supabaseAuth = {
  // Sign up with email
  async signUpWithEmail(email: string, password: string, metadata?: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata, // Store additional user info
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with OAuth providers
  async signInWithProvider(provider: 'google' | 'linkedin' | 'github') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: provider === 'linkedin' 
          ? 'r_emailaddress r_liteprofile' 
          : 'email profile',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) throw error;
    return data;
  },

  // Sign in with magic link
  async signInWithMagicLink(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: false, // Require signup first
      },
    });
    
    if (error) throw error;
    return data;
  },

  // Session management
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data.session;
  },

  // User management
  async updateUser(updates: any) {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
```

### Supabase Auth Hooks

```typescript
// hooks/use-supabase-auth.ts
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/auth/supabase-auth';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            // Track login
            await trackAuthEvent('login', { method: session?.user?.app_metadata?.provider });
            break;
          case 'SIGNED_OUT':
            // Clear local data
            await clearLocalData();
            break;
          case 'TOKEN_REFRESHED':
            // Session refreshed successfully
            console.log('Token refreshed');
            break;
          case 'USER_UPDATED':
            // Profile updated
            await syncUserProfile(session?.user);
            break;
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    isAuthenticated: !!session,
    signIn: supabaseAuth.signInWithProvider,
    signOut: supabaseAuth.signOut,
  };
}
```

### Supabase Row Level Security (RLS) Integration

```sql
-- Enhanced RLS policies for authentication
-- policies/auth_policies.sql

-- Users can only read their own profile
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Meetings belong to authenticated user
CREATE POLICY "Users can manage own meetings" 
ON meetings FOR ALL 
USING (auth.uid() = user_id);

-- Practice sessions belong to user
CREATE POLICY "Users can manage own practice" 
ON practice_sessions FOR ALL 
USING (auth.uid() = user_id);

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  );
  
  -- Set default preferences
  INSERT INTO public.user_preferences (user_id, created_at)
  VALUES (NEW.id, NOW());
  
  -- Track signup source
  INSERT INTO public.auth_audit_log (user_id, event, metadata)
  VALUES (
    NEW.id,
    'signup',
    jsonb_build_object(
      'provider', NEW.raw_app_meta_data->>'provider',
      'email', NEW.email,
      'timestamp', NOW()
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 2. Stack Auth Integration

### Stack Auth Configuration

```typescript
// lib/auth/stack-auth.ts
import { StackClient, StackClientApp } from '@stackauth/stack';

// Initialize Stack Auth
export const stackAuth = new StackClient({
  appId: process.env.NEXT_PUBLIC_STACK_APP_ID!,
  publishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_KEY!,
  // Optional: point to your Supabase backend
  apiUrl: process.env.STACK_API_URL,
});

// Stack Auth App instance
export const stackApp = stackAuth.app;

// Stack Auth configuration
export const stackConfig = {
  // OAuth providers
  oauthProviders: [
    {
      id: 'google',
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID!,
      scope: ['email', 'profile'],
    },
    {
      id: 'linkedin',
      enabled: true,
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      scope: ['r_emailaddress', 'r_liteprofile'],
    },
    {
      id: 'github',
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID!,
      scope: ['user:email', 'read:user'],
    },
  ],
  
  // MFA settings
  mfa: {
    enabled: true,
    methods: ['totp', 'sms'],
    enforceForRoles: ['admin', 'enterprise'],
  },
  
  // Team features
  teams: {
    enabled: true,
    allowUserCreateTeam: true,
    maxTeamSize: 100,
  },
  
  // SSO settings (Enterprise)
  sso: {
    enabled: true,
    providers: ['saml', 'oidc'],
  },
};
```

### Stack Auth React Components

```tsx
// components/auth/stack-auth-provider.tsx
import { StackAuthProvider, useStackAuth } from '@stackauth/stack-react';
import { stackAuth } from '@/lib/auth/stack-auth';
import { supabase } from '@/lib/auth/supabase-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <StackAuthProvider client={stackAuth}>
      <SupabaseStackSync>
        {children}
      </SupabaseStackSync>
    </StackAuthProvider>
  );
}

// Sync Stack Auth with Supabase
function SupabaseStackSync({ children }: { children: React.ReactNode }) {
  const stackUser = useStackAuth();
  
  useEffect(() => {
    if (stackUser.isAuthenticated) {
      // Sync Stack Auth user with Supabase
      syncWithSupabase(stackUser.user);
    }
  }, [stackUser.isAuthenticated]);
  
  async function syncWithSupabase(stackUser: any) {
    // Check if user exists in Supabase
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', stackUser.email)
      .single();
    
    if (!existingUser) {
      // Create user in Supabase if doesn't exist
      await supabase.auth.admin.createUser({
        email: stackUser.email,
        email_confirm: true,
        app_metadata: {
          provider: 'stack',
          stack_id: stackUser.id,
        },
        user_metadata: {
          full_name: stackUser.displayName,
          avatar_url: stackUser.profileImageUrl,
        },
      });
    }
  }
  
  return <>{children}</>;
}
```

### Stack Auth Login Component

```tsx
// components/auth/stack-login.tsx
import { useStackAuth, SignIn, UserButton } from '@stackauth/stack-react';
import { Button } from '@/components/ui/button';

export function StackLogin() {
  const auth = useStackAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <UserButton 
          showTeamSwitcher={true}
          afterSignOutUrl="/"
        />
      </div>
    );
  }

  return (
    <SignIn
      // Customize appearance
      appearance={{
        theme: 'light',
        variables: {
          colorPrimary: '#6366f1',
          borderRadius: '0.5rem',
        },
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary-dark',
        },
      }}
      
      // OAuth providers
      oauthProviders={['google', 'linkedin', 'github']}
      
      // Additional options
      afterSignInUrl="/dashboard"
      signUpUrl="/signup"
      
      // Custom fields for signup
      signUpFields={[
        { name: 'currentRole', label: 'Current Role', type: 'select', options: ['PM', 'Senior PM', 'Director'] },
        { name: 'company', label: 'Company', type: 'text', required: false },
      ]}
      
      // Callbacks
      onSignInSuccess={async (user) => {
        // Sync with Supabase after successful login
        await syncUserWithSupabase(user);
        
        // Track event
        analytics.track('user_signed_in', {
          method: user.signInMethod,
          provider: user.oauthProvider,
        });
      }}
    />
  );
}
```

---

## 3. Unified Auth Flow

### Combined Authentication Flow

```typescript
// lib/auth/unified-auth.ts
import { supabaseAuth } from './supabase-auth';
import { stackAuth } from './stack-auth';

export class UnifiedAuth {
  // Determine which auth system to use
  static async signIn(method: 'email' | 'oauth' | 'magic' | 'sso', options: any) {
    switch (method) {
      case 'email':
        // Use Supabase for email/password
        return await supabaseAuth.signUpWithEmail(options.email, options.password);
        
      case 'oauth':
        // Use Stack Auth for social login (better UI/UX)
        return await stackAuth.signInWithOAuth(options.provider);
        
      case 'magic':
        // Use Supabase for magic links
        return await supabaseAuth.signInWithMagicLink(options.email);
        
      case 'sso':
        // Use Stack Auth for enterprise SSO
        return await stackAuth.signInWithSSO(options.domain);
    }
  }

  // Unified session management
  static async getSession() {
    // Check Stack Auth first (if using social/SSO)
    const stackSession = await stackAuth.getSession();
    if (stackSession) {
      return {
        user: stackSession.user,
        provider: 'stack',
        session: stackSession,
      };
    }

    // Fall back to Supabase
    const supabaseSession = await supabaseAuth.getSession();
    if (supabaseSession) {
      return {
        user: supabaseSession.user,
        provider: 'supabase',
        session: supabaseSession,
      };
    }

    return null;
  }

  // Unified sign out
  static async signOut() {
    // Sign out from both services
    await Promise.all([
      stackAuth.signOut().catch(() => {}),
      supabaseAuth.signOut().catch(() => {}),
    ]);
    
    // Clear local storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to home
    window.location.href = '/';
  }

  // MFA setup (using Stack Auth)
  static async setupMFA(method: 'totp' | 'sms') {
    return await stackAuth.mfa.enable(method);
  }

  // Team management (using Stack Auth)
  static async createTeam(name: string, metadata?: any) {
    const team = await stackAuth.teams.create({
      name,
      metadata,
    });
    
    // Store team info in Supabase
    await supabase.from('teams').insert({
      id: team.id,
      name: team.name,
      created_by: team.createdBy,
      metadata,
    });
    
    return team;
  }
}
```

### Auth Context with Both Providers

```tsx
// contexts/auth-context.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { UnifiedAuth } from '@/lib/auth/unified-auth';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useStackAuth } from '@stackauth/stack-react';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (method: string, options: any) => Promise<void>;
  signOut: () => Promise<void>;
  provider: 'supabase' | 'stack' | null;
  features: {
    mfa: boolean;
    teams: boolean;
    sso: boolean;
  };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabaseAuth();
  const stack = useStackAuth();
  const [unifiedUser, setUnifiedUser] = useState<User | null>(null);
  const [provider, setProvider] = useState<'supabase' | 'stack' | null>(null);

  useEffect(() => {
    // Determine active auth provider and user
    if (stack.isAuthenticated && stack.user) {
      setUnifiedUser(transformStackUser(stack.user));
      setProvider('stack');
    } else if (supabase.isAuthenticated && supabase.user) {
      setUnifiedUser(transformSupabaseUser(supabase.user));
      setProvider('supabase');
    } else {
      setUnifiedUser(null);
      setProvider(null);
    }
  }, [stack.isAuthenticated, supabase.isAuthenticated]);

  const value: AuthContextValue = {
    user: unifiedUser,
    loading: supabase.loading || stack.isLoading,
    isAuthenticated: !!unifiedUser,
    signIn: UnifiedAuth.signIn,
    signOut: UnifiedAuth.signOut,
    provider,
    features: {
      mfa: provider === 'stack',
      teams: provider === 'stack',
      sso: provider === 'stack',
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 4. Database Schema Updates

### Additional Auth Tables for Stack Auth Integration

```sql
-- Tables for Stack Auth integration
CREATE TABLE auth_providers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'supabase', 'stack', 'google', 'linkedin', etc.
    provider_user_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);

-- Teams table for Stack Auth teams
CREATE TABLE teams (
    id TEXT PRIMARY KEY, -- Stack Auth team ID
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    created_by UUID REFERENCES profiles(id),
    subscription_tier TEXT DEFAULT 'free',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- MFA settings
CREATE TABLE mfa_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    method TEXT CHECK (method IN ('totp', 'sms', 'email')),
    enabled BOOLEAN DEFAULT false,
    secret TEXT, -- Encrypted
    backup_codes TEXT[], -- Encrypted
    phone_number TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SSO configurations (Enterprise)
CREATE TABLE sso_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
    provider TEXT CHECK (provider IN ('saml', 'oidc')),
    idp_url TEXT,
    client_id TEXT,
    metadata JSONB,
    enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log for auth events
CREATE TABLE auth_audit_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    event TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_auth_providers_user_id ON auth_providers(user_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_auth_audit_log_user_id ON auth_audit_log(user_id);
CREATE INDEX idx_auth_audit_log_created_at ON auth_audit_log(created_at);
```

---

## 5. Security Enhancements

### Session Security

```typescript
// lib/auth/session-security.ts
export class SessionSecurity {
  // Implement session fingerprinting
  static generateFingerprint(): string {
    const data = [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.colorDepth,
      screen.width,
      screen.height,
    ].join('|');
    
    return btoa(data);
  }

  // Validate session consistency
  static async validateSession(session: any): Promise<boolean> {
    const currentFingerprint = this.generateFingerprint();
    const storedFingerprint = session.user?.user_metadata?.fingerprint;
    
    if (storedFingerprint && currentFingerprint !== storedFingerprint) {
      // Potential session hijacking
      await this.reportSecurityEvent('session_fingerprint_mismatch', {
        stored: storedFingerprint,
        current: currentFingerprint,
      });
      
      return false;
    }
    
    return true;
  }

  // Rate limiting for auth attempts
  static async checkRateLimit(identifier: string): Promise<boolean> {
    const key = `auth_attempts:${identifier}`;
    const attempts = await redis.get(key) || 0;
    
    if (attempts > 5) {
      // Too many attempts
      return false;
    }
    
    await redis.incr(key);
    await redis.expire(key, 900); // 15 minutes
    
    return true;
  }

  // Report security events
  static async reportSecurityEvent(event: string, metadata: any) {
    await supabase.from('auth_audit_log').insert({
      event,
      metadata,
      ip_address: await this.getClientIP(),
      user_agent: navigator.userAgent,
    });
  }
}
```

---

## 6. Migration Path

### Step-by-Step Migration

```typescript
// scripts/migrate-to-unified-auth.ts
export async function migrateToUnifiedAuth() {
  console.log('Starting auth migration...');
  
  // Step 1: Set up Stack Auth project
  await setupStackAuth();
  
  // Step 2: Migrate existing Supabase users
  const { data: users } = await supabase.from('profiles').select('*');
  
  for (const user of users || []) {
    try {
      // Create user in Stack Auth
      await stackAuth.admin.createUser({
        email: user.email,
        emailVerified: true,
        metadata: {
          supabaseId: user.id,
          migratedAt: new Date().toISOString(),
        },
      });
      
      // Update auth_providers table
      await supabase.from('auth_providers').insert({
        user_id: user.id,
        provider: 'stack',
        provider_user_id: user.email,
      });
      
      console.log(`Migrated user: ${user.email}`);
    } catch (error) {
      console.error(`Failed to migrate user ${user.email}:`, error);
    }
  }
  
  console.log('Migration complete!');
}
```

---

## 7. Benefits of This Architecture

### Why Supabase + Stack Auth?

1. **Supabase Strengths**:
   - Already integrated with your database
   - Row Level Security (RLS) out of the box
   - Real-time subscriptions for auth state
   - Built-in PostgreSQL integration
   - Cost-effective for core auth

2. **Stack Auth Strengths**:
   - Beautiful pre-built UI components
   - Enterprise features (MFA, SSO, Teams)
   - Better OAuth provider management
   - Advanced session management
   - Compliance features (SOC2, GDPR)

3. **Combined Benefits**:
   - Use Supabase for data, Stack for auth UI
   - Seamless integration between both
   - Enterprise-ready from day one
   - Flexibility to use best tool for each need
   - Progressive enhancement path

---

## Implementation Timeline

### Week 1: Foundation
- [ ] Set up Stack Auth account
- [ ] Configure OAuth providers in Stack
- [ ] Update database schema
- [ ] Implement unified auth class

### Week 2: Integration
- [ ] Build auth components
- [ ] Sync Stack with Supabase
- [ ] Implement session management
- [ ] Add security features

### Week 3: Migration
- [ ] Migrate existing users
- [ ] Update frontend auth flows
- [ ] Test all auth methods
- [ ] Deploy to staging

### Week 4: Enhancement
- [ ] Add MFA support
- [ ] Implement team features
- [ ] Set up SSO for enterprise
- [ ] Security audit

---

This architecture gives you the best of both worlds: Supabase's excellent database integration and Stack Auth's superior authentication UX and enterprise features!