'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { Resource } from '@/types/resource';
import Link from 'next/link';
import { Phone, Mail, Calendar, ExternalLink, Info, Share2, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icon issue in Next.js
const userIcon = new Icon({
  iconUrl: '/images/user-marker.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const resourceIcon = new Icon({
  iconUrl: '/images/resource-marker.svg',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const DEFAULT_ZOOM = 10;

interface MapWithLeafletProps {
  position: [number, number];
  resources: Resource[];
  selectedResource: Resource | null;
  onSelectResource: (resource: Resource | null) => void;
}

const MapWithLeaflet = ({ position, resources, selectedResource, onSelectResource }: MapWithLeafletProps) => {
  useEffect(() => {
    // This is needed to fix the marker icon issue in Leaflet with Next.js
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/resource-marker.svg',
      iconUrl: '/images/resource-marker.svg',
      shadowUrl: '',
    });
  }, []);

  const handleShare = (resource: Resource) => {
    const text = `Check out ${resource.Organization} - ${resource.ResourceType}\n${resource.Address}, ${resource.City}, ${resource.State} ${resource.Zip}`;
    if (navigator.share) {
      navigator.share({
        title: resource.Organization,
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Resource information copied to clipboard!');
    }
  };

  const handleGetDirections = (resource: Resource) => {
    const address = `${resource.Address}, ${resource.City}, ${resource.State} ${resource.Zip}`;
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <MapContainer
      center={position}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full"
      zoomControl={false}
    >
      <ZoomControl position="topright" />
      
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
      />

      {/* User location marker */}
      <Marker position={position} icon={userIcon}>
        <Popup>Your Location</Popup>
      </Marker>

      {/* Resource markers */}
      {resources.map((resource) => (
        <Marker
          key={resource.id}
          position={[resource.latitude, resource.longitude]}
          icon={resourceIcon}
          eventHandlers={{
            click: () => onSelectResource(resource),
          }}
        >
          <Popup>
            <div className="p-2 min-w-[250px]">
              <h3 className="text-lg font-semibold mb-2">
                {resource.Organization}
              </h3>
              
              {/* Address and Type */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  {resource.Address}
                  {resource.City && `, ${resource.City}`}
                  {resource.State && `, ${resource.State}`}
                  {resource.Zip && ` ${resource.Zip}`}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span> {resource.ResourceType}
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-4">
                {resource.ContactPerson && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Contact:</span> {resource.ContactPerson}
                  </p>
                )}
                {resource.ContactPersonPhone && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    <a href={`tel:${resource.ContactPersonPhone}`} className="text-blue-600 hover:text-blue-800">
                      {resource.ContactPersonPhone}
                    </a>
                  </p>
                )}
                {resource.ContactPersonEmail && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <a href={`mailto:${resource.ContactPersonEmail}`} className="text-blue-600 hover:text-blue-800">
                      {resource.ContactPersonEmail}
                    </a>
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                {resource.Website && (
                  <Link
                    href={resource.Website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-healthcare-600 text-white px-3 py-1.5 rounded-md hover:bg-healthcare-700 transition-colors text-sm text-center flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={16} />
                    Visit Website
                  </Link>
                )}
                <Link
                  href={`/resources/${resource.id}`}
                  className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 transition-colors text-sm text-center flex items-center justify-center gap-2"
                >
                  <Info size={16} />
                  View Details
                </Link>
                <Link
                  href={`/book-appointment?resourceId=${resource.id}`}
                  className="bg-healthcare-100 text-healthcare-700 px-3 py-1.5 rounded-md hover:bg-healthcare-200 transition-colors text-sm text-center flex items-center justify-center gap-2"
                >
                  <Calendar size={16} />
                  Book Appointment
                </Link>
                <button
                  onClick={() => handleGetDirections(resource)}
                  className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-200 transition-colors text-sm text-center flex items-center justify-center gap-2"
                >
                  <Navigation size={16} />
                  Get Directions
                </button>
                <button
                  onClick={() => handleShare(resource)}
                  className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-md hover:bg-purple-200 transition-colors text-sm text-center flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithLeaflet;
