import React, { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { Location } from '../types';

interface LocationInputProps {
  location: Location | null;
  onLocationChange: (location: Location) => void;
  isLoading: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({ 
  location, 
  onLocationChange,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Use Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        onLocationChange({
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          city: result.display_name.split(',')[0],
          country: result.display_name.split(',').slice(-1)[0].trim(),
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocoding to get city and country
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            
            onLocationChange({
              latitude,
              longitude,
              city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
              country: data.address?.country || 'Unknown',
            });
          } catch (error) {
            onLocationChange({ latitude, longitude });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md mb-4">
      <div className="flex items-center mb-3">
        <MapPin size={18} className="mr-2 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">Location</h3>
      </div>
      
      {location && (
        <div className="mb-3 flex items-center">
          <div className="bg-indigo-50 px-3 py-2 rounded-lg flex items-center">
            <MapPin size={16} className="text-indigo-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {location.city ? `${location.city}, ${location.country}` : 'Current Location'}
              </p>
              <p className="text-xs text-gray-500">
                {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isSearching || isLoading}
          className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 flex items-center"
        >
          <Search size={16} className="mr-1" />
          <span>Search</span>
        </button>
      </form>
      
      <div className="mt-3 flex justify-center">
        <button
          onClick={handleGetCurrentLocation}
          disabled={isLoading}
          className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors flex items-center"
        >
          <MapPin size={14} className="mr-1" />
          Use my current location
        </button>
      </div>
    </div>
  );
};

export default LocationInput;
