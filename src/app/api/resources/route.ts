import { NextResponse } from 'next/server';
import { geocodeAddress } from '../../../utils/geocoding';
import fs from 'fs';
import path from 'path';

const DEFAULT_COORDINATES = {
  lat: 35.2271, // North Carolina center latitude
  lng: -80.8431  // North Carolina center longitude
};

export async function GET() {
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), 'public', 'data', 'resources.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const resourceData = JSON.parse(fileContents);

    // Add IDs and filter out empty resources
    const validResources = resourceData
      .filter((resource: any) => resource.Organization && resource.Organization.trim())
      .map((resource: any, index: number) => ({
        ...resource,
        id: resource.id || `resource-${index + 1}`,
      }));

    console.log(`Processing ${validResources.length} valid resources...`);

    // Process resources in batches to avoid rate limits
    const batchSize = 10;
    const processedResources = [];

    for (let i = 0; i < validResources.length; i += batchSize) {
      const batch = validResources.slice(i, i + batchSize);
      const batchPromises = batch.map(async (resource: any) => {
        if (!resource.latitude || !resource.longitude) {
          const address = [
            resource.Address,
            resource.City,
            'NC',
            resource.Zip
          ].filter(Boolean).join(', ');

          if (address.trim()) {
            try {
              const coordinates = await geocodeAddress(address);
              return {
                ...resource,
                latitude: coordinates?.lat || DEFAULT_COORDINATES.lat,
                longitude: coordinates?.lng || DEFAULT_COORDINATES.lng
              };
            } catch (error) {
              console.error(`Error geocoding address for ${resource.Organization}:`, error);
              return {
                ...resource,
                latitude: DEFAULT_COORDINATES.lat,
                longitude: DEFAULT_COORDINATES.lng
              };
            }
          }
        }
        return resource;
      });

      const batchResults = await Promise.all(batchPromises);
      processedResources.push(...batchResults);

      // Add a small delay between batches to respect rate limits
      if (i + batchSize < validResources.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      resources: processedResources,
      total: processedResources.length
    });
  } catch (error) {
    console.error('Error processing resources:', error);
    return NextResponse.json(
      { error: 'Failed to process resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Read existing resources
    const filePath = path.join(process.cwd(), 'public', 'data', 'resources.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const resources = JSON.parse(fileContents);
    
    // Add new resource
    const newResource = {
      ...data,
      id: `resource-${resources.length + 1}`,
      createdAt: new Date().toISOString()
    };
    
    resources.push(newResource);
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(resources, null, 2));
    
    return NextResponse.json(newResource);
  } catch (error) {
    console.error('Error adding resource:', error);
    return NextResponse.json(
      { error: 'Failed to add resource' },
      { status: 500 }
    );
  }
}
