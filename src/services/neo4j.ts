import neo4j, { Driver, Session } from 'neo4j-driver';

let driver: Driver | null = null;

export async function initDriver() {
  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const user = process.env.NEO4J_USER || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'password';

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

  try {
    await driver.verifyConnectivity();
    console.log('Connected to Neo4j');
  } catch (error) {
    console.error('Error connecting to Neo4j:', error);
    throw error;
  }
}

export async function getSession(): Promise<Session> {
  if (!driver) {
    await initDriver();
  }
  return driver!.session();
}

export async function closeDriver() {
  if (driver) {
    await driver.close();
    driver = null;
  }
}

export async function getLocations() {
  const session = await getSession();
  try {
    const result = await session.run(
      'MATCH (l:Location) RETURN l'
    );
    return result.records.map(record => record.get('l').properties);
  } finally {
    await session.close();
  }
}

export async function addLocation(location: any) {
  const session = await getSession();
  try {
    const result = await session.run(
      `
      CREATE (l:Location {
        name: $name,
        address: $address,
        city: $city,
        state: $state,
        zip: $zip,
        latitude: $latitude,
        longitude: $longitude,
        createdAt: datetime()
      }) RETURN l
      `,
      location
    );
    return result.records[0].get('l').properties;
  } finally {
    await session.close();
  }
}

export async function searchLocations(query: string) {
  const session = await getSession();
  try {
    const result = await session.run(
      `
      MATCH (l:Location)
      WHERE l.name =~ $query OR l.address =~ $query OR l.city =~ $query
      RETURN l
      ORDER BY l.name
      LIMIT 10
      `,
      { query: `(?i).*${query}.*` }
    );
    return result.records.map(record => record.get('l').properties);
  } finally {
    await session.close();
  }
}

export default {
  initDriver,
  getSession,
  closeDriver,
  getLocations,
  addLocation,
  searchLocations,
};
