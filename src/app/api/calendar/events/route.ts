import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const cookies = request.headers.get('cookie');
    if (!cookies) {
      return NextResponse.json({ error: 'No cookies found' }, { status: 401 });
    }

    // Parse cookies
    const cookieMap = new Map(
      cookies.split(';').map(cookie => {
        const [key, value] = cookie.trim().split('=');
        return [key, value];
      })
    );

    const accessToken = cookieMap.get('access_token');
    const refreshToken = cookieMap.get('refresh_token');

    if (!accessToken && !refreshToken) {
      return NextResponse.json({ error: 'No tokens found' }, { status: 401 });
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/google/callback'
        : 'http://localhost:3000/api/auth/google/callback'
    );

    // Try to use access token first
    if (accessToken) {
      oauth2Client.setCredentials({
        access_token: accessToken,
        refresh_token: refreshToken
      });
    } else if (refreshToken) {
      // If no access token but have refresh token, try to refresh
      try {
        const { credentials } = await oauth2Client.refreshToken(refreshToken);
        oauth2Client.setCredentials(credentials);

        // Update cookies with new tokens
        const response = NextResponse.next();
        
        if (credentials.access_token) {
          response.cookies.set('access_token', credentials.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600 // 1 hour
          });
        }

        if (credentials.refresh_token) {
          response.cookies.set('refresh_token', credentials.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 // 30 days
          });
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return NextResponse.json({ error: 'Token refresh failed' }, { status: 401 });
      }
    }

    // Create calendar client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get start and end times for time range (default to next 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    // Get events
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: thirtyDaysFromNow.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items?.map(event => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: event.start,
      end: event.end,
      location: event.location,
    })) || [];

    return NextResponse.json(events);

  } catch (error: any) {
    console.error('Calendar events error:', error);

    // Check if token expired or invalid
    if (
      error.message?.includes('invalid_grant') || 
      error.message?.includes('Invalid Credentials') ||
      error.message?.includes('invalid_token')
    ) {
      // Clear tokens and redirect to re-authenticate
      const response = NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      response.cookies.delete('access_token');
      response.cookies.delete('refresh_token');
      return response;
    }

    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}
