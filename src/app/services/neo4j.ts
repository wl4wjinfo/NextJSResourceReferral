import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver;

export const initNeo4j = () => {
  const uri = process.env.NEO4J_URI || 'neo4j://localhost:7687';
  const user = process.env.NEO4J_USER || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || '';

  driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  return driver;
};

export const getDriver = () => {
  if (!driver) {
    return initNeo4j();
  }
  return driver;
};

export const closeDriver = () => {
  if (driver) {
    driver.close();
  }
};

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
}

export const getLocations = async (): Promise<Location[]> => {
  const driver = getDriver();
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (l:Location)
      RETURN 
        l.id as id,
        l.name as name,
        l.latitude as latitude,
        l.longitude as longitude,
        l.type as type
    `);

    return result.records.map(record => ({
      id: record.get('id'),
      name: record.get('name'),
      latitude: record.get('latitude').toNumber(),
      longitude: record.get('longitude').toNumber(),
      type: record.get('type')
    }));
  } finally {
    await session.close();
  }
};
