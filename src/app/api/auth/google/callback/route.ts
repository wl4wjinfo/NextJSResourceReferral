import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_SITE_URL 
  : 'http://localhost:3000';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(`${BASE_URL}/calendar?error=No_authorization_code`);
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${BASE_URL}/api/auth/google/callback`
    );

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.redirect(`${BASE_URL}/calendar?error=Configuration_error`);
    }

    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      if (!tokens.access_token || !tokens.refresh_token) {
        return NextResponse.redirect(`${BASE_URL}/calendar?error=Token_error`);
      }

      const response = NextResponse.redirect(`${BASE_URL}/calendar`);

      // Set cookies
      response.cookies.set('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600 // 1 hour
      });

      response.cookies.set('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 3600 // 7 days
      });

      return response;
    } catch (error) {
      console.error('Token error:', error);
      return NextResponse.redirect(`${BASE_URL}/calendar?error=Token_error`);
    }
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(`${BASE_URL}/calendar?error=Internal_server_error`);
  }
}
