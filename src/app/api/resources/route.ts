import { NextResponse } from 'next/server';
import resourceData from '@/misc/WL4WJ_ResourceSpreadsheet.json';
import { geocodeAddress } from '@/utils/geocoding';

const DEFAULT_COORDINATES = {
  lat: 35.2271, // North Carolina center latitude
  lng: -80.8431  // North Carolina center longitude
};

export async function GET() {
  try {
    // Add IDs and filter out empty resources
    const validResources = resourceData
      .filter((resource: any) => resource.Organization && resource.Organization.trim())
      .map((resource: any, index: number) => ({
        ...resource,
        id: resource.id || `resource-${index + 1}`,
      }));

    console.log(`Processing ${validResources.length} valid resources...`);

    // Geocode addresses for resources that don't have coordinates
    const geocodedResources = await Promise.all(
      validResources.map(async (resource) => {
        // If resource already has valid coordinates, use them
        if (typeof resource.latitude === 'number' && 
            typeof resource.longitude === 'number' &&
            !isNaN(resource.latitude) && 
            !isNaN(resource.longitude)) {
          return resource;
        }

        // Construct the most complete address possible
        const addressParts = [];
        if (resource.Address) addressParts.push(resource.Address.trim());
        if (resource.City) addressParts.push(resource.City.trim());
        if (resource['State ']) addressParts.push(resource['State '].trim());
        if (resource.Zip) addressParts.push(resource.Zip.toString().trim());

        // If we have no address information, use default coordinates
        if (addressParts.length === 0) {
          console.warn('No address information for resource:', resource.Organization);
          return {
            ...resource,
            latitude: DEFAULT_COORDINATES.lat,
            longitude: DEFAULT_COORDINATES.lng,
            geocodedAddress: 'Location not specified'
          };
        }

        const address = addressParts.join(', ');
        
        try {
          const geocoded = await geocodeAddress(address);
          if (geocoded) {
            return {
              ...resource,
              latitude: geocoded.lat,
              longitude: geocoded.lng,
              geocodedAddress: geocoded.formattedAddress
            };
          } else {
            console.warn('Failed to geocode address for:', resource.Organization);
            // If geocoding fails, use default coordinates
            return {
              ...resource,
              latitude: DEFAULT_COORDINATES.lat,
              longitude: DEFAULT_COORDINATES.lng,
              geocodedAddress: address
            };
          }
        } catch (error) {
          console.error('Error geocoding resource:', resource.Organization, error);
          // On error, use default coordinates
          return {
            ...resource,
            latitude: DEFAULT_COORDINATES.lat,
            longitude: DEFAULT_COORDINATES.lng,
            geocodedAddress: address
          };
        }
      })
    );

    console.log(`Successfully processed ${geocodedResources.length} resources`);
    return NextResponse.json(geocodedResources);
  } catch (error) {
    console.error('Error processing resources:', error);
    return NextResponse.json({ error: 'Failed to process resources' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const resource = await request.json();
    
    // Construct the most complete address possible
    const addressParts = [];
    if (resource.Address) addressParts.push(resource.Address.trim());
    if (resource.City) addressParts.push(resource.City.trim());
    if (resource['State ']) addressParts.push(resource['State '].trim());
    if (resource.Zip) addressParts.push(resource.Zip.toString().trim());

    const address = addressParts.join(', ');
    
    // Geocode the address
    const geocoded = await geocodeAddress(address);
    
    // Use geocoded coordinates or default coordinates
    const coordinates = geocoded || DEFAULT_COORDINATES;

    // Add metadata to the resource
    const newResource = {
      ...resource,
      IsRecordComplete_: 'Yes',
      LastDateUpdated: new Date().toISOString(),
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      geocodedAddress: geocoded ? geocoded.formattedAddress : address
    };

    return NextResponse.json(newResource);
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
