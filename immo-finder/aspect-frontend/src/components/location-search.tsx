'use client';

import * as React from "react"
import { apiFetch, buildQueryParams } from '@/lib/api';

interface LocationSuggestion {
  placeId: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
  types: string[];
}

interface LocationSearchProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number; placeId: string; formattedAddress: string }) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationSearch({ onLocationSelect, placeholder = 'Search for a location...', className = '' }: LocationSearchProps) {
  const [query, setQuery] = React.useState('');
  const [predictions, setPredictions] = React.useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup abort controller on unmount
  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) {
      setPredictions([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    try {
      const language = 'en';
      const queryParams = buildQueryParams({ query: value, language });
      const response = await apiFetch<LocationSuggestion[]>(
        `/api/locations/search${queryParams}`,
        { signal }
      );

      if (response && response.length > 0) {
        setPredictions(response);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } else {
        setPredictions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
      setShowDropdown(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceSelect = (suggestion: LocationSuggestion) => {
    onLocationSelect({
      address: suggestion.formattedAddress,
      lat: suggestion.latitude,
      lng: suggestion.longitude,
      placeId: suggestion.placeId,
      formattedAddress: suggestion.formattedAddress,
    });
    setQuery(suggestion.description);
    setPredictions([]);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || predictions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev: number) => (prev < predictions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev: number) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < predictions.length) {
          handlePlaceSelect(predictions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (predictions.length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-t-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showDropdown && predictions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {predictions.map((prediction, index) => (
            <button
              key={prediction.placeId}
              type="button"
              onClick={() => handlePlaceSelect(prediction)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors ${
                index === selectedIndex ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex flex-col">
                <div className="font-medium text-gray-900">
                  {prediction.description}
                </div>
                {prediction.types && prediction.types.length > 0 && (
                  <div className="text-sm text-gray-500 mt-1">
                    {prediction.types.join(', ')}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {prediction.formattedAddress}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
