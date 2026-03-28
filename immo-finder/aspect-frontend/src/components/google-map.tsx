'use client';

import * as React from "react";

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    label?: string;
  }>;
  onMarkerClick?: (marker: { lat: number; lng: number }) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initGoogleMapsCallback?: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center,
  zoom = 14,
  markers = [],
  onMarkerClick,
  className = '',
}) => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const markersRef = React.useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initGoogleMapsCallback`;
      script.async = true;
      script.defer = true;
      
      // Define callback for when script loads
      window.initGoogleMapsCallback = () => {
        setIsLoaded(true);
      };

      // Handle script load error
      script.onerror = () => {
        setError('Failed to load Google Maps. Please check your API key.');
      };

      document.head.appendChild(script);
    };

    loadGoogleMapsScript();

    // Cleanup
    return () => {
      window.initGoogleMapsCallback = undefined;
    };
  }, []);

  React.useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google || !window.google.maps) {
      return;
    }

    try {
      // Create map
      const map = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        mapTypeId: 'roadmap',
      });

      // Clear existing markers
      markersRef.current.forEach((marker) => {
        if (marker) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];

      // Add new markers
      markers.forEach((marker, index) => {
        const googleMarker = new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: map,
          title: marker.label || '',
        });

        if (onMarkerClick) {
          googleMarker.addListener('click', () => {
            onMarkerClick({ lat: marker.lat, lng: marker.lng });
          });
        }

        markersRef.current[index] = googleMarker;
      });

      // Cleanup function
      return () => {
        markersRef.current.forEach((marker) => {
          if (marker) {
            marker.setMap(null);
          }
        });
      };
    } catch (err) {
      console.error('Error initializing Google Map:', err);
      setError('Error initializing map. Please try again.');
    }
  }, [isLoaded, center, zoom, markers, onMarkerClick]);

  if (error) {
    return (
      <div className={`w-full h-96 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-red-600">
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-2">Please check your Google Maps API key configuration.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} className={`w-full h-96 rounded-lg overflow-hidden ${className}`} />
  );
};

export { GoogleMap };
