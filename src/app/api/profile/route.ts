import { NextResponse } from 'next/server';

// This is a mock database for now. In a real app, you would use your actual database.
let mockProfile = {
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@healthcare.com',
  specialty: 'Cardiology',
  hospital: 'City General Hospital',
  phone: '+1 (555) 123-4567',
  address: '123 Medical Center Dr, Boston, MA 02115',
  bio: 'Board-certified cardiologist with over 10 years of experience in treating cardiovascular diseases.',
  languages: ['English', 'Mandarin'],
  education: [
    'MD - Harvard Medical School',
    'Residency - Massachusetts General Hospital',
  ],
  eventsAttended: [],
  tshirtSize: ''
};

export async function GET() {
  try {
    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const updates = await request.json();
    
    // In a real app, validate the updates and save to database
    mockProfile = { ...mockProfile, ...updates };

    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error('Failed to update profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
