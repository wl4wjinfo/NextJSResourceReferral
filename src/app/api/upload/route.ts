import { NextRequest, NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        
        if (!process.env.NEO4J_URI || !process.env.NEO4J_USER || !process.env.NEO4J_PASSWORD) {
            throw new Error('Neo4j environment variables are not properly configured');
        }

        // Connect to Neo4j using environment variables
        const driver = neo4j.driver(
            process.env.NEO4J_URI,
            neo4j.auth.basic(
                process.env.NEO4J_USER,
                process.env.NEO4J_PASSWORD
            )
        );

        const session = driver.session();

        try {
            // Clear existing data
            await session.run('MATCH (n) DETACH DELETE n');

            // Create resources
            for (const resource of data) {
                await session.run(
                    `
                    CREATE (r:Resource {
                        organization: $organization,
                        address: $address,
                        city: $city,
                        state: $state,
                        zip: $zip,
                        resourceType: $resourceType,
                        contactPerson: $contactPerson,
                        contactPersonPhone: $contactPersonPhone,
                        website: $website,
                        resourceDescription: $resourceDescription,
                        latitude: $latitude,
                        longitude: $longitude
                    })
                    `,
                    {
                        organization: resource.Organization,
                        address: resource.Address,
                        city: resource.City,
                        state: resource['State '],
                        zip: resource.Zip,
                        resourceType: resource.ResourceType,
                        contactPerson: resource.ContactPerson,
                        contactPersonPhone: resource.ContactPersonPhone,
                        website: resource.Website,
                        resourceDescription: resource.ResourceDescription,
                        latitude: resource.geocoded?.location.lat || null,
                        longitude: resource.geocoded?.location.lng || null
                    }
                );
            }

            return NextResponse.json({ message: 'Data uploaded successfully' });
        } finally {
            await session.close();
            await driver.close();
        }
    } catch (error) {
        console.error('Error uploading data:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to upload data' },
            { status: 500 }
        );
    }
}
