import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRateLimitStats } from '@/lib/middleware/rateLimiter';

// GET /api/health - Health check endpoint
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const supabase = createClient();
    const { data, error: dbError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true })
      .limit(1);

    const dbHealthy = !dbError;
    
    // Get system stats
    const rateLimitStats = getRateLimitStats();
    const responseTime = Date.now() - startTime;
    
    // Determine overall health
    const isHealthy = dbHealthy;
    const status = isHealthy ? 'healthy' : 'unhealthy';
    const httpStatus = isHealthy ? 200 : 503;

    return NextResponse.json({
      status,
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: {
          status: dbHealthy ? 'healthy' : 'unhealthy',
          error: dbError?.message || null
        },
        rateLimiter: {
          status: 'healthy',
          activeKeys: rateLimitStats.activeKeys,
          violations: rateLimitStats.violations
        }
      },
      performance: {
        responseTimeMs: responseTime,
        uptime: process.uptime()
      }
    }, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      performance: {
        responseTimeMs: Date.now() - startTime
      }
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}