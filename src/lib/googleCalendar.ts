import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

export const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const calendar = google.calendar({ version: 'v3', auth });

export async function getCalendarEvents() {
  try {
    const response = await calendar.events.list({
      calendarId: 'wl4wjinfo@gmail.com',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

export async function addCalendarEvent(event: {
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  location?: string;
}) {
  try {
    const response = await calendar.events.insert({
      calendarId: 'wl4wjinfo@gmail.com',
      requestBody: event,
    });

    return response.data;
  } catch (error) {
    console.error('Error adding calendar event:', error);
    throw error;
  }
}
