import { LoadScriptProps, useLoadScript } from '@react-google-maps/api'

// Define all required libraries
const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization" | "marker")[] = ["places", "geometry", "marker"];

// Create a memoized loader options object
const LOADER_OPTIONS = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  libraries,
  id: 'google-map-script',
  version: 'weekly',
  nonce: undefined,
  language: 'en',
  region: 'US',
  preventGoogleFontsLoading: false,
  channel: undefined,
  cookiePolicy: "NONE"
} as const;

export function useGoogleMapsLoader() {
  return useLoadScript(LOADER_OPTIONS);
}

// Export constants to ensure consistent usage
export { libraries, LOADER_OPTIONS };
