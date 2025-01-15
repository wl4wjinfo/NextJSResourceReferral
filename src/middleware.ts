import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_SITE_URL 
  : 'http://localhost:3000';

// List of paths that require authentication
const protectedPaths = [
  '/calendar',
  '/profile',
  '/dashboard',
  '/messages',
  '/events',
  '/map',
  '/book-appointment',
  '/resource',
  '/resources'
]

// List of paths that are public
const publicPaths = [
  '/signin',
  '/signup',
  '/privacy',
  '/terms',
  '/',
  '/api/auth/google/callback'
]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow public paths
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next()
  }

  // Check if path is protected
  const isProtectedPath = protectedPaths.some(p => path.startsWith(p))
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // Get JWT token from cookie
  const token = request.cookies.get('jwt')?.value

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/signin`)
  }

  try {
    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch (error) {
    // If token is invalid, redirect to signin
    return NextResponse.redirect(`${BASE_URL}/signin`)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
