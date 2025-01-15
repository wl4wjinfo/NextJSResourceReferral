import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { errors } = await request.json();
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `geocoding-errors-${timestamp}.txt`;
    const filepath = path.join(process.cwd(), 'src', 'misc', filename);

    await fs.writeFile(filepath, errors);

    return NextResponse.json({ success: true, filepath });
  } catch (error) {
    console.error('Error writing to file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to write error log' },
      { status: 500 }
    );
  }
}
