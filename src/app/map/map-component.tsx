'use client';

import { useCallback, memo, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { Resource, loadResources } from '../services/resources';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default center (Fayetteville, NC)
const defaultCenter = {
  lat: 35.0527,
  lng: -78.8784
};

const libraries: ("places")[] = ["places"];

const MapComponent = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  useEffect(() => {
    const loadResourceData = async () => {
      try {
        setLoading(true);
        const data = await loadResources();
        console.log('Loaded resources:', data);
        setResources(data);
        setError(null);
      } catch (error) {
        console.error('Error loading resources:', error);
        setError('Failed to load resources. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadResourceData();
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    
    if (resources.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      resources.forEach(resource => {
        if (resource.latitude && resource.longitude) {
          bounds.extend({ lat: resource.latitude, lng: resource.longitude });
        }
      });
      map.fitBounds(bounds);
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(10);
    }
  }, [resources]);

  const onMarkerClick = useCallback((resource: Resource) => {
    setSelectedResource(resource);
  }, []);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {error && (
        <div className="absolute top-4 left-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="absolute top-4 right-4 z-10 bg-white px-4 py-2 rounded shadow">
        <p className="text-sm font-medium">
          Showing {resources.length} resources
        </p>
      </div>
      {selectedResource && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-xl mb-2">{selectedResource.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedResource.category}</p>
              
              {/* Location Information */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-1">Location</h4>
                <p className="text-sm">
                  {selectedResource.address}, {selectedResource.city}, NC {selectedResource.zip}
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-4">
                <h4 className="font-medium text-sm mb-1">Contact Information</h4>
                {selectedResource.contactPerson && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Contact Person:</span> {selectedResource.contactPerson}
                    {selectedResource.contactPersonPhone && (
                      <> - <a href={`tel:${selectedResource.contactPersonPhone}`} className="text-blue-500 hover:underline">
                        {selectedResource.contactPersonPhone}
                      </a></>
                    )}
                    {selectedResource.contactPersonEmail && (
                      <> - <a href={`mailto:${selectedResource.contactPersonEmail}`} className="text-blue-500 hover:underline">
                        {selectedResource.contactPersonEmail}
                      </a></>
                    )}
                  </p>
                )}
                {selectedResource.generalContactName && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Department:</span> {selectedResource.generalContactName}
                    {selectedResource.generalContactPhone && (
                      <> - <a href={`tel:${selectedResource.generalContactPhone}`} className="text-blue-500 hover:underline">
                        {selectedResource.generalContactPhone}
                      </a></>
                    )}
                  </p>
                )}
                {selectedResource.website && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Website:</span>{' '}
                    <a href={selectedResource.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Visit Website
                    </a>
                  </p>
                )}
              </div>

              {/* Status Information */}
              {(selectedResource.currentStatus || selectedResource.lastContactDate) && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-1">Status</h4>
                  {selectedResource.currentStatus && (
                    <p className="text-sm mb-1">
                      <span className="font-medium">Current Status:</span> {selectedResource.currentStatus}
                    </p>
                  )}
                  {selectedResource.lastContactDate && (
                    <p className="text-sm">
                      <span className="font-medium">Last Contact:</span> {selectedResource.lastContactDate}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              {/* Services */}
              {selectedResource.services.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-1">Services</h4>
                  <ul className="list-disc list-inside text-sm">
                    {selectedResource.services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resource Description */}
              {selectedResource.resourceDescription && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-1">Description</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedResource.resourceDescription}</p>
                </div>
              )}

              {/* Eligibility */}
              {selectedResource.eligibility && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-1">Eligibility Requirements</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedResource.eligibility}</p>
                </div>
              )}

              {/* How to Apply */}
              {selectedResource.howToApply && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-1">How to Apply</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedResource.howToApply}</p>
                </div>
              )}

              {/* Notes */}
              {selectedResource.notes && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-1">Additional Notes</h4>
                  <p className="text-sm whitespace-pre-wrap">{selectedResource.notes}</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setSelectedResource(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
        options={{
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID
        }}
      >
        {resources.map((resource, index) => (
          resource.latitude && resource.longitude ? (
            <MarkerF
              key={resource.id || index}
              position={{
                lat: resource.latitude,
                lng: resource.longitude
              }}
              onClick={() => onMarkerClick(resource)}
              title={resource.name}
            />
          ) : null
        ))}
      </GoogleMap>
    </div>
  );
};

export default memo(MapComponent);
