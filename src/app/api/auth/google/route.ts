import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly'
];

export async function GET() {
  try {
    // Check environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('Missing Google OAuth credentials');
      return new NextResponse('OAuth configuration error', { status: 500 });
    }

    // Create OAuth client
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'http://localhost:3000/api/auth/google/callback'
    );

    // Generate auth URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      include_granted_scopes: true,
      prompt: 'consent',
      state: 'healthcare_referrals_auth',
      // Add branding parameters
      hd: 'localhost:3000', // Hosted domain
      response_type: 'code',
      // Add additional parameters for better UX
      login_hint: 'wl4wjinfo@gmail.com'
    });

    // Redirect to Google's OAuth page
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('OAuth initialization error:', error);
    return new NextResponse('Failed to initialize OAuth', { status: 500 });
  }
}
