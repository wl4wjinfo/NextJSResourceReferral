'use client';

import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export function useGoogleMapsLoader() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load()
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
      });
  }, []);

  return isLoaded;
}
