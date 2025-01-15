import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const encoder = new TextEncoder();

// List of public routes that don't require authentication
const publicRoutes = ['/signin', '/signup', '/forgot-password'];

export async function middleware(request: NextRequest) {
  console.log('Middleware processing request:', request.nextUrl.pathname);
  
  // Set CSP headers for all responses
  const response = NextResponse.next();
  
  // Add CSP headers to allow Google Maps
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.googleapis.com https://*.gstatic.com;
    style-src 'self' 'unsafe-inline' https://*.googleapis.com;
    img-src 'self' data: https://*.googleapis.com https://*.gstatic.com;
    font-src 'self' https://*.gstatic.com;
    connect-src 'self' https://*.googleapis.com;
  `.replace(/\s+/g, ' ').trim();

  response.headers.set('Content-Security-Policy', cspHeader);

  // Allow root path for splash page
  if (request.nextUrl.pathname === '/') {
    console.log('Allowing access to root path');
    return response;
  }

  // Don't check auth for public routes
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    console.log('Public route detected:', request.nextUrl.pathname);
    return response;
  }

  // Check for auth token
  const token = request.cookies.get('auth-token');
  console.log('Auth token found:', !!token);

  if (!token) {
    console.log('No auth token, redirecting to signin');
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  try {
    // Create secret key
    const secretKey = await encoder.encode(JWT_SECRET);
    
    // Verify the token
    await jose.jwtVerify(token.value, secretKey);
    
    console.log('Token verified successfully');
    return response;
  } catch (error) {
    // If token is invalid, redirect to signin
    console.error('Token verification failed:', error);
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
