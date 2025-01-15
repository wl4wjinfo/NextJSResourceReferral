import { NextResponse } from 'next/server';
import { getSession } from '../services/neo4j.service';

export async function GET() {
  const session = await getSession();
  
  try {
    const result = await session.run(
      `
      MATCH (u:User)
      RETURN u {
        .id,
        .name,
        .email,
        .role,
        .createdAt
      } as user
      ORDER BY u.createdAt DESC
      `
    );

    const users = result.records.map(record => record.get('user'));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}
