import { Database } from 'arangojs';

class DatabaseService {
  constructor() {
    this.db = new Database({
      url: 'http://localhost:8529',
      databaseName: '_system',
      auth: { username: 'root', password: 'Yfhk9r76q@@12345' }
    });
    this.organizationsCollection = this.db.collection('WL4WJHealthCareReferrals');
  }

  async initializeDatabase() {
    try {
      const collectionExists = await this.organizationsCollection.exists();
      if (!collectionExists) {
        await this.organizationsCollection.create();
        // Create geospatial index for location-based queries
        await this.organizationsCollection.ensureIndex({
          type: 'geo',
          fields: ['location.coordinates'],
          name: 'geo_location'
        });
      }
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  async addOrganization(organization) {
    try {
      const doc = await this.organizationsCollection.save({
        ...organization,
        createdAt: new Date().toISOString()
      });
      return doc;
    } catch (error) {
      console.error('Error adding organization:', error);
      throw error;
    }
  }

  async searchOrganizationsByLocation(latitude, longitude, radius = 5000) {
    try {
      console.log('Searching with coordinates:', { latitude, longitude, radius });
      const query = `
        FOR org IN WL4WJHealthCareReferrals
        LET distance = DISTANCE(org.location.coordinates[0], org.location.coordinates[1], @lat, @lon)
        FILTER distance <= @radius
        SORT distance ASC
        RETURN MERGE(org, { distance: distance })
      `;
      
      const cursor = await this.db.query(query, {
        lat: latitude,
        lon: longitude,
        radius: radius
      });
      
      const results = await cursor.all();
      console.log('Found organizations:', results.length);
      return results;
    } catch (error) {
      console.error('Error searching organizations:', error);
      throw error;
    }
  }
}

export default new DatabaseService();
