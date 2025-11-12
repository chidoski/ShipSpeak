import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/middleware/rateLimiter';
import { validateInput } from '@/lib/middleware/validation';

// Registration request schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['PM', 'Senior PM', 'Staff PM', 'Principal PM', 'Group PM', 'Director', 'VP Product', 'CPO', 'Product Owner'], {
    errorMap: () => ({ message: 'Invalid role selected' })
  })
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting for authentication
    const rateLimitResult = await rateLimit(request, 'auth', 20);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many registration attempts. Please try again later.',
          retryAfter: rateLimitResult.retryAfter
        },
        { status: 429 }
      );
    }

    // Validate input
    const body = await request.json();
    const validationResult = validateInput(registerSchema, body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.errors
        },
        { status: 400 }
      );
    }

    const { email, password, name, role } = validationResult.data;
    const supabase = createClient();

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.getUser();
    if (existingUser?.user?.email === email) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Create user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });

    if (error) {
      console.error('Registration error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (data.user) {
      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name,
          role: data.user.user_metadata?.role
        },
        requiresOnboarding: true,
        message: 'Registration successful. Please check your email for verification.'
      }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Registration API error:', error);
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