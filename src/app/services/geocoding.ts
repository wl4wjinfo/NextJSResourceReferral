interface GeocodeResult {
  lat: number;
  lng: number;
}

export const geocodeAddress = async (address: string): Promise<GeocodeResult | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      return { lat, lng };
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};
