export interface GeocodingResult {
  lat: number;
  lng: number;
  formattedAddress: string;
}

export class GeocodingService {
  private apiKey: string;
  private maxRetries = 3;
  private retryDelay = 2000; // 2 seconds
  private timeout = 10000; // 10 seconds

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(url: string, attempt: number) {
    const controller = new AbortController();
    const timeoutDuration = this.timeout * attempt; // Increase timeout with each attempt
    const id = setTimeout(() => controller.abort(), timeoutDuration);

    try {
      console.debug(`Fetching with timeout ${timeoutDuration}ms...`);
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'HealthcareReferrals/1.0'
        }
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeoutDuration}ms`);
      }
      throw error;
    }
  }

  async geocodeAddress(address: string): Promise<GeocodingResult | null> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.debug(`Geocoding attempt ${attempt} for address: ${address}`);
        
        // Add state and country to improve geocoding accuracy
        const fullAddress = `${address}, NC, USA`;
        const encodedAddress = encodeURIComponent(fullAddress);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.apiKey}`;
        
        const response = await this.fetchWithTimeout(url, attempt);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'OVER_QUERY_LIMIT') {
          console.warn('Query limit exceeded, retrying after delay...');
          await this.wait(this.retryDelay * attempt);
          continue;
        }

        if (data.status === 'ZERO_RESULTS') {
          console.warn('No results found for address:', address);
          return null;
        }

        if (data.status !== 'OK' || !data.results || data.results.length === 0) {
          throw new Error(`Geocoding failed with status: ${data.status}`);
        }

        const result = data.results[0];
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          formattedAddress: result.formatted_address
        };
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed:`, error);
        
        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
          console.debug(`Retrying after ${delay}ms...`);
          await this.wait(delay);
        }
      }
    }

    console.error('All geocoding attempts failed for address:', address, lastError);
    return null;
  }
}

export const geocodingService = new GeocodingService(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '');
