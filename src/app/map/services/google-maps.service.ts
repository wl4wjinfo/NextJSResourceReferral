import { Loader } from '@googlemaps/js-api-loader';

export interface GeocodingError {
  address: string;
  organization: string;
  error: string;
  timestamp: string;
}

export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

class GoogleMapsService {
  private static instance: GoogleMapsService;
  private geocoder: google.maps.Geocoder | null = null;
  private loader: Loader;
  private geocodingErrors: GeocodingError[] = [];

  private constructor() {
    this.loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  }

  public static getInstance(): GoogleMapsService {
    if (!GoogleMapsService.instance) {
      GoogleMapsService.instance = new GoogleMapsService();
    }
    return GoogleMapsService.instance;
  }

  public async init(): Promise<void> {
    try {
      await this.loader.load();
      this.geocoder = new google.maps.Geocoder();
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      throw error;
    }
  }

  public async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    if (!this.geocoder) {
      await this.init();
    }

    try {
      const response = await this.geocoder?.geocode({ address });
      
      if (response && response.results[0]) {
        const { lat, lng } = response.results[0].geometry.location.toJSON();
        return {
          lat,
          lng,
          formattedAddress: response.results[0].formatted_address
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  public async batchGeocodeAddresses(resources: { resource: any, address: string }[]): Promise<(GeocodingResult | null)[]> {
    if (!this.geocoder) {
      await this.init();
    }

    // Clear previous errors
    this.geocodingErrors = [];

    // Process in batches to avoid rate limiting
    const batchSize = 10;
    const results: (GeocodingResult | null)[] = [];
    
    for (let i = 0; i < resources.length; i += batchSize) {
      const batch = resources.slice(i, i + batchSize);
      const batchPromises = batch.map(async ({ resource, address }) => {
        try {
          const response = await this.geocoder?.geocode({ address });
          
          if (response && response.results[0]) {
            const { lat, lng } = response.results[0].geometry.location.toJSON();
            return {
              lat,
              lng,
              formattedAddress: response.results[0].formatted_address
            };
          }
          
          // Log error if no results found
          this.geocodingErrors.push({
            address,
            organization: resource.Organization,
            error: 'No results found',
            timestamp: new Date().toISOString()
          });
          return null;
        } catch (error) {
          // Log geocoding error
          this.geocodingErrors.push({
            address,
            organization: resource.Organization,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          });
          return null;
        }
      });
      
      // Add delay between batches to respect rate limits
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }

  public getGeocodingErrors(): GeocodingError[] {
    return this.geocodingErrors;
  }
}

export const googleMapsService = GoogleMapsService.getInstance();
