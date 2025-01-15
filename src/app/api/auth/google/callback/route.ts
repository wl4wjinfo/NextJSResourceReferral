import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      console.error('No authorization code present');
      return NextResponse.redirect(new URL('/calendar?error=No_authorization_code', request.url));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('Missing OAuth credentials');
      return NextResponse.redirect(new URL('/calendar?error=Configuration_error', request.url));
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'http://localhost:3000/api/auth/google/callback'
    );

    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens) {
      console.error('Failed to get tokens');
      return NextResponse.redirect(new URL('/calendar?error=Token_error', request.url));
    }

    // Store tokens in cookies
    const response = NextResponse.redirect(new URL('/calendar', request.url));
    
    // Set access token cookie (short-lived)
    response.cookies.set('access_token', tokens.access_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
    });

    // Set refresh token cookie (long-lived)
    if (tokens.refresh_token) {
      response.cookies.set('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });
    }

    return response;

  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(new URL('/calendar?error=Internal_server_error', request.url));
  }
}
