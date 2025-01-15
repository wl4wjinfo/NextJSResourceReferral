export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  try {
    console.log('Geocoding address:', address);
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }

    const data = await response.json();
    console.log('Geocoding response:', data);

    if (data.status !== 'OK' || !data.results || !data.results[0]) {
      console.warn('No geocoding results for address:', address);
      return null;
    }

    const result = data.results[0];
    const { lat, lng } = result.geometry.location;
    
    return {
      lat,
      lng,
      formattedAddress: result.formatted_address
    };
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}
