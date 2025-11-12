import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/middleware/rateLimiter';
import { validateInput } from '@/lib/middleware/validation';

// Login request schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting for authentication
    const rateLimitResult = await rateLimit(request, 'auth', 20);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many login attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter
        },
        { status: 429 }
      );
    }

    // Validate input
    const body = await request.json();
    const validationResult = validateInput(loginSchema, body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.errors
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;
    const supabase = createClient();

    // Authenticate user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (data.user) {
      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return NextResponse.json(
          { error: 'Failed to fetch user profile' },
          { status: 500 }
        );
      }

      const requiresOnboarding = !profile?.current_role;

      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.full_name || data.user.email,
          role: profile?.current_role,
          industry: profile?.industry,
          onboardingCompleted: !requiresOnboarding
        },
        token: data.session?.access_token,
        requiresOnboarding,
        message: 'Login successful'
      }, { status: 200 });
    }

    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}