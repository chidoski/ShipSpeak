import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Define route categories
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup')
  const isOnboardingRoute = pathname.startsWith('/onboarding')
  const isProtectedRoute = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/meetings') ||
                          pathname.startsWith('/practice') ||
                          pathname.startsWith('/progress') ||
                          pathname.startsWith('/settings') ||
                          pathname.startsWith('/coaching') ||
                          pathname.startsWith('/modules')
  const isPasswordResetRoute = pathname.startsWith('/reset-password')

  // If no session and accessing protected routes
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If session exists and on auth routes
  if (session && isAuthRoute) {
    // Check if user needs onboarding by querying the database
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_role, industry')
        .eq('id', session.user.id)
        .single();

      // If user doesn't have a role set, they need onboarding
      if (!profile?.current_role) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }

      // User is authenticated and completed onboarding
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      console.error('Error checking user profile:', error);
      // Fallback to dashboard if we can't check profile
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Allow password reset route regardless of auth state
  if (isPasswordResetRoute) {
    return response
  }

  // Handle onboarding flow
  if (session && isOnboardingRoute) {
    // Check if user has already completed onboarding
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_role')
        .eq('id', session.user.id)
        .single();

      // If user has completed onboarding, redirect to dashboard
      if (profile?.current_role) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
    
    return response;
  }

  // Check onboarding completion for protected routes
  if (session && isProtectedRoute) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_role')
        .eq('id', session.user.id)
        .single();

      // If user hasn't completed onboarding, redirect to onboarding
      if (!profile?.current_role) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
    } catch (error) {
      console.error('Error checking onboarding for protected route:', error);
      // Allow access if we can't check - better than blocking access
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}