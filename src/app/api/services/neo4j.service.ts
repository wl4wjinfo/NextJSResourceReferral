import neo4j, { Driver, Session } from 'neo4j-driver';
import crypto from 'crypto';

let driver: Driver;

export async function initNeo4j() {
  try {
    if (!driver) {
      const uri = process.env.NEO4J_URI;
      const user = process.env.NEO4J_USER;
      const password = process.env.NEO4J_PASSWORD;

      if (!uri || !user || !password) {
        throw new Error('Missing Neo4j credentials in environment variables');
      }

      console.log('Initializing Neo4j connection...');
      driver = neo4j.driver(
        uri,
        neo4j.auth.basic(user, password),
        {
          maxConnectionLifetime: 3 * 60 * 60 * 1000, // 3 hours
          maxConnectionPoolSize: 50,
          connectionAcquisitionTimeout: 2000, // 2 seconds
        }
      );

      // Verify connection
      const session = driver.session();
      try {
        await session.run('RETURN 1');
        console.log('Neo4j connection successful');
      } finally {
        await session.close();
      }
    }
    return driver;
  } catch (error) {
    console.error('Neo4j initialization error:', error);
    throw error;
  }
}

export async function getSession(): Promise<Session> {
  const driver = await initNeo4j();
  return driver.session();
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return verifyHash === hash;
}

export async function verifyCredentials(email: string, password: string): Promise<{ 
  valid: boolean; 
  user?: { 
    id: string;
    email: string;
    role: string;
  }
}> {
  const session = await getSession();
  try {
    const result = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );

    if (result.records.length === 0) {
      return { valid: false };
    }

    const user = result.records[0].get('u').properties;
    const isValid = verifyPassword(password, user.password, user.salt);

    if (!isValid) {
      return { valid: false };
    }

    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  } finally {
    await session.close();
  }
}

export async function createAdminUser(email: string, password: string): Promise<void> {
  const session = await getSession();
  try {
    // Check if admin user already exists
    const existingUser = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );

    if (existingUser.records.length > 0) {
      return; // Admin user already exists
    }

    // Hash the password using crypto
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');

    // Create admin user
    await session.run(
      `
      CREATE (u:User {
        id: randomUUID(),
        email: $email,
        password: $hashedPassword,
        salt: $salt,
        role: 'admin',
        createdAt: datetime(),
        name: 'Admin User'
      })
      `,
      { email, hashedPassword, salt }
    );
  } finally {
    await session.close();
  }
}

export async function closeNeo4j() {
  if (driver) {
    await driver.close();
    driver = undefined as any;
  }
}
