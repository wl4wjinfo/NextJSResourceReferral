import { NextResponse } from 'next/server';
import { getSession } from '../../services/neo4j.service';
import crypto from 'crypto';

// Password hashing function using crypto
function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return { hash, salt };
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await getSession();

    try {
      // Check if user already exists
      const existingUser = await session.run(
        'MATCH (u:User {email: $email}) RETURN u',
        { email }
      );

      if (existingUser.records.length > 0) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        );
      }

      // Hash password
      const { hash: hashedPassword, salt } = hashPassword(password);

      // Create user
      const result = await session.run(
        `
        CREATE (u:User {
          id: randomUUID(),
          name: $name,
          email: $email,
          password: $hashedPassword,
          salt: $salt,
          role: 'user',
          createdAt: datetime()
        })
        RETURN u
        `,
        { name, email, hashedPassword, salt }
      );

      const user = result.records[0].get('u').properties;

      return NextResponse.json({
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
