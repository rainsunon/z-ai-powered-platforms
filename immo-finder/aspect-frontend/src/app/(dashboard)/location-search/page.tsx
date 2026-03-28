'use client';

import * as React from "react"
import LocationSearch from "@/components/location-search"
import { GoogleMap } from "@/components/google-map"

export default function LocationSearchPage() {
  const [selectedLocation, setSelectedLocation] = React.useState<{
    lat: number;
    lng: number;
    address: string;
    formattedAddress: string;
    placeId: string;
  } | null>(null);
  
  const [markers, setMarkers] = React.useState<Array<{
    lat: number;
    lng: number;
    label: string;
  }>>([]);

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
    formattedAddress: string;
    placeId: string;
  }) => {
    setSelectedLocation(location);
    setMarkers([{
      lat: location.lat,
      lng: location.lng,
      label: location.formattedAddress,
    }]);
  };

  const handleMarkerClick = (marker: { lat: number; lng: number }) => {
    console.log('Marker clicked:', marker);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Location Search</h1>
          <p className="text-gray-600">Find locations using Google Maps</p>
        </div>

        {/* Location Search */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Search Location</h2>
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            placeholder="Search for a city, address, or postal code..."
            className="max-w-2xl"
          />
        </div>

        {/* Map Display */}
        {selectedLocation && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Selected Location</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-medium text-gray-900 mb-2">
                {selectedLocation.formattedAddress}
              </p>
              <p className="text-sm text-gray-600">
                Latitude: {selectedLocation.lat.toFixed(6)}, Longitude: {selectedLocation.lng.toFixed(6)}
              </p>
              <p className="text-xs text-gray-500">
                Place ID: {selectedLocation.placeId}
              </p>
            </div>
          </div>
        )}

        {/* Google Map */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Map</h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '500px' }}>
            <GoogleMap
              center={selectedLocation ? { lat: selectedLocation.lat, lng: selectedLocation.lng } : { lat: 43.6532, lng: -79.3832 }}
              zoom={selectedLocation ? 16 : 10}
              markers={markers}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>© 2025 Immo Finder. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
