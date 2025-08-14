'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Navigation, Globe } from 'lucide-react';
import { searchLocations, getCurrentLocation, reverseGeocode, popularCities, type LocationSuggestion } from '@/services/location';
import { analyticsService } from '@/services/analytics';
import { cn } from '@/lib/utils';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = "e.g., San Francisco, CA",
  disabled = false,
  className,
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPopular, setShowPopular] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Update query when value changes externally
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error searching locations:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowPopular(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const selectedValue = suggestion.formatted;
    setQuery(selectedValue);
    onChange(selectedValue);
    setShowSuggestions(false);
    setShowPopular(false);
    
    // Track location selection
    analyticsService.track('location_autocomplete_used', {
      location: selectedValue,
      source: 'api_suggestion',
      country: suggestion.country,
    });
  };

  const handlePopularCityClick = (city: string) => {
    setQuery(city);
    onChange(city);
    setShowPopular(false);
    
    // Track popular city selection
    analyticsService.track('location_autocomplete_used', {
      location: city,
      source: 'popular_city',
    });
  };

  const handleInputFocus = () => {
    if (query.length === 0) {
      setShowPopular(true);
    } else if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const coords = await getCurrentLocation();
      if (coords) {
        const locationName = await reverseGeocode(coords.lat, coords.lon);
        if (locationName) {
          setQuery(locationName);
          onChange(locationName);
          setShowSuggestions(false);
          setShowPopular(false);
          
          // Track current location usage
          analyticsService.track('location_autocomplete_used', {
            location: locationName,
            source: 'current_location',
            coordinates: `${coords.lat},${coords.lon}`,
          });
        }
      }
    } catch (error) {
      console.error('Error getting current location:', error);
      
      // Track error
      analyticsService.trackError('location_autocomplete_error', error.toString(), 'current_location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("pr-10", className)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <MapPin className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation || disabled}
          title="Use my current location"
        >
          {isGettingLocation ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Location Suggestions */}
      {(showSuggestions || showPopular) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {showSuggestions && suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Suggestions
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.place_id}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm flex items-center gap-2"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                  <span className="truncate">{suggestion.formatted}</span>
                </button>
              ))}
            </div>
          )}

          {showPopular && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Popular Cities
              </div>
              <div className="grid grid-cols-1 gap-1">
                {popularCities.slice(0, 8).map((city) => (
                  <button
                    key={city}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-sm flex items-center gap-2"
                    onClick={() => handlePopularCityClick(city)}
                  >
                    <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="truncate">{city}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showSuggestions && suggestions.length === 0 && !isLoading && query.length >= 2 && (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No locations found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}