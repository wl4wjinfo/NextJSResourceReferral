import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { verifyCredentials, createAdminUser } from '../../services/neo4j.service';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

export async function POST(request: Request) {
  try {
    console.log('Login request received');
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    // For the default admin account, ensure it exists and has the correct password
    if (email === DEFAULT_ADMIN_EMAIL) {
      console.log('Creating/updating admin user...');
      await createAdminUser(DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD);
      
      // If they're using the default admin email but a different password, reject
      if (password !== DEFAULT_ADMIN_PASSWORD) {
        console.log('Invalid password for admin account');
        return NextResponse.json(
          { error: 'Invalid credentials for admin account' },
          { status: 401 }
        );
      }
    }

    // Verify credentials against Neo4j
    console.log('Verifying credentials...');
    const { valid, user } = await verifyCredentials(email, password);
    console.log('Verification result:', { valid, userEmail: user?.email });

    if (!valid || !user) {
      console.log('Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token using jose
    console.log('Creating JWT token...');
    const secretKey = new TextEncoder().encode(JWT_SECRET);
    const token = await new jose.SignJWT({ 
      id: user.id,
      email: user.email,
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secretKey);

    // Create the response with user data
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

    // Set the token as an HTTP-only cookie
    console.log('Setting auth cookie...');
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    console.log('Login successful');
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
