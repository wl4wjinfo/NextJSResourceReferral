'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import MapComponent from './map-component';

export default function MapPageClient() {
  const [latitude, setLatitude] = useState(33.7488);
  const [longitude, setLongitude] = useState(-84.3877);
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [resourceCount, setResourceCount] = useState(0);
  const [filterParams, setFilterParams] = useState({
    resourceType: 'all',
    category: '',
    status: '',
    zipCode: '',
    distance: 50
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Filter Panel */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${isFilterExpanded ? 'w-80' : 'w-12'}`}>
        <button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          className="w-full p-3 flex items-center justify-between bg-healthcare-600 text-white"
        >
          {isFilterExpanded && <span>Filters</span>}
          {isFilterExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {isFilterExpanded && (
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Type
              </label>
              <select
                value={filterParams.resourceType}
                onChange={(e) => setFilterParams({ ...filterParams, resourceType: e.target.value })}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="all">All Resources</option>
                <option value="hospital">Hospitals</option>
                <option value="clinic">Clinics</option>
                <option value="specialist">Specialists</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                value={filterParams.zipCode}
                onChange={(e) => setFilterParams({ ...filterParams, zipCode: e.target.value })}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Enter ZIP code"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (miles)
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={filterParams.distance}
                onChange={(e) => setFilterParams({ ...filterParams, distance: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">
                {filterParams.distance} miles
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              Showing {resourceCount} resources
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapComponent
          position={[latitude, longitude]}
          filterParams={filterParams}
          onFilteredCountChange={setResourceCount}
        />
      </div>
    </div>
  );
}
