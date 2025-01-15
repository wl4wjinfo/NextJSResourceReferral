import { NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';

// Create driver instance
const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  ),
  {
    maxTransactionRetryTime: 30000, // 30 seconds
    connectionTimeout: 30000 // 30 seconds
  }
);

export const maxDuration = 60; // Set max duration to 60 seconds

export async function POST(request: Request) {
  const session = driver.session({
    database: 'neo4j',
    defaultAccessMode: neo4j.session.WRITE
  });

  try {
    // First, ensure the properties exist
    console.log('Adding latitude and longitude properties if they don\'t exist...');
    await session.executeWrite(async (tx) => {
      const setupQuery = `
        MATCH (r:Resource)
        WHERE r.latitude IS NULL OR r.longitude IS NULL
        SET r.latitude = 0.0,
            r.longitude = 0.0
        RETURN count(r) as addedCount
      `;
      const setupResult = await tx.run(setupQuery);
      const addedCount = setupResult.records[0].get('addedCount').low;
      console.log(`Added coordinate properties to ${addedCount} resources`);
    });

    const resources = await request.json();
    console.log(`\n=== Starting coordinate update for ${resources.length} resources ===\n`);

    // Process resources in smaller batches
    const BATCH_SIZE = 10;
    const batches = [];
    for (let i = 0; i < resources.length; i += BATCH_SIZE) {
      batches.push(resources.slice(i, i + BATCH_SIZE));
    }

    let totalUpdated = 0;
    for (const [batchIndex, batch] of batches.entries()) {
      console.log(`\nProcessing batch ${batchIndex + 1} of ${batches.length}...`);

      // Now update the coordinates
      const result = await session.executeWrite(async (tx) => {
        const updates = batch.map(async (resource: any) => {
          if (!resource.organization) {
            console.warn(' Skipping resource with missing organization:', resource);
            return null;
          }

          if (!resource.geocoded?.location?.lat || !resource.geocoded?.location?.lng) {
            console.warn(` Skipping resource with missing geocoded coordinates: ${resource.organization}`);
            return null;
          }

          console.log(`\n Resource: ${resource.organization}`);
          console.log(`   Address: ${resource.geocoded.formattedAddress || resource.address || 'N/A'}`);
          console.log(`   Coordinates: ${resource.geocoded.location.lat}, ${resource.geocoded.location.lng}`);

          const query = `
            MATCH (r:Resource {organization: $organization})
            SET r.latitude = $lat,
                r.longitude = $lng,
                r.lastUpdated = datetime(),
                r.geocodedAddress = $address
            RETURN r
          `;

          try {
            const params = {
              organization: resource.organization,
              lat: neo4j.float(resource.geocoded.location.lat),
              lng: neo4j.float(resource.geocoded.location.lng),
              address: resource.geocoded.formattedAddress || resource.address || ''
            };

            const result = await tx.run(query, params);
            console.log('   Successfully updated in Neo4j\n');
            return result;
          } catch (error) {
            console.error(`   Error updating resource: ${resource.organization}`, error);
            return null;
          }
        });

        const results = await Promise.all(updates);
        return results.filter(r => r !== null);
      });

      const batchUpdated = result.reduce((acc, r) => acc + (r?.records?.length || 0), 0);
      totalUpdated += batchUpdated;
      console.log(`Batch ${batchIndex + 1}: Updated ${batchUpdated} resources`);
    }

    console.log(`\n=== Successfully updated ${totalUpdated} resources with geocoded coordinates ===\n`);

    return NextResponse.json({ 
      success: true, 
      message: `Updated coordinates for ${totalUpdated} resources`,
      count: totalUpdated
    });
  } catch (error) {
    console.error('Error in update-coordinates route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update coordinates',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  } finally {
    await session.close();
  }
}
