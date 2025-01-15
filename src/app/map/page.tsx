import { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Map View',
  description: 'Interactive map view',
};

// Import the map component dynamically to avoid SSR issues
const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-healthcare-600"></div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="w-full h-screen">
      <MapComponent />
    </div>
  );
}
