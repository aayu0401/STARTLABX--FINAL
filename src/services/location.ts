// Location service using OpenStreetMap's Nominatim API (free, no API key required)

export interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
  type: string;
  importance: number;
  // Parsed components
  city?: string;
  state?: string;
  country?: string;
  formatted: string;
}

interface NominatimResponse {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: string;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  importance: number;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

// Cache for recent searches to reduce API calls
const searchCache = new Map<string, LocationSuggestion[]>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  if (!query || query.length < 2) {
    return [];
  }

  // Check cache first
  const cacheKey = query.toLowerCase().trim();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey) || [];
  }

  try {
    // Nominatim API endpoint (free, no API key required)
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', query);
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');
    url.searchParams.set('limit', '8');
    url.searchParams.set('countrycodes', 'us,ca,gb,au,de,fr,es,it,jp,kr,in,br,mx,nl,se,dk,no,fi,ch,at,be,ie,nz,sg,hk'); // Major countries
    url.searchParams.set('class', 'place');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'StartLabX-Platform/1.0', // Required by Nominatim
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NominatimResponse[] = await response.json();

    const suggestions: LocationSuggestion[] = data
      .filter(item => item.importance > 0.3) // Filter out less relevant results
      .map(item => {
        const address = item.address || {};
        const city = address.city || address.town || address.village;
        const state = address.state;
        const country = address.country;

        // Format display name nicely
        let formatted = item.display_name;
        if (city && state && country) {
          formatted = `${city}, ${state}, ${country}`;
        } else if (city && country) {
          formatted = `${city}, ${country}`;
        } else if (state && country) {
          formatted = `${state}, ${country}`;
        }

        return {
          display_name: item.display_name,
          lat: item.lat,
          lon: item.lon,
          place_id: item.place_id,
          type: item.type,
          importance: item.importance,
          city,
          state,
          country,
          formatted,
        };
      })
      .sort((a, b) => b.importance - a.importance); // Sort by importance

    // Cache the results
    searchCache.set(cacheKey, suggestions);
    
    // Clear cache after duration
    setTimeout(() => {
      searchCache.delete(cacheKey);
    }, CACHE_DURATION);

    return suggestions;
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
}

// Get user's approximate location (optional, requires permission)
export async function getCurrentLocation(): Promise<{ lat: number; lon: number } | null> {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => {
        resolve(null); // Don't throw error, just return null
      },
      {
        timeout: 5000,
        enableHighAccuracy: false,
      }
    );
  });
}

// Reverse geocoding - get location name from coordinates
export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/reverse');
    url.searchParams.set('lat', lat.toString());
    url.searchParams.set('lon', lon.toString());
    url.searchParams.set('format', 'json');
    url.searchParams.set('addressdetails', '1');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'StartLabX-Platform/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NominatimResponse = await response.json();
    const address = data.address || {};
    const city = address.city || address.town || address.village;
    const state = address.state;
    const country = address.country;

    if (city && state && country) {
      return `${city}, ${state}, ${country}`;
    } else if (city && country) {
      return `${city}, ${country}`;
    } else if (state && country) {
      return `${state}, ${country}`;
    }

    return data.display_name;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
}

// Common major cities for quick suggestions (fallback if API is slow)
export const popularCities = [
  'New York, NY, USA',
  'San Francisco, CA, USA',
  'Los Angeles, CA, USA',
  'London, England, UK',
  'Berlin, Germany',
  'Paris, France',
  'Tokyo, Japan',
  'Toronto, ON, Canada',
  'Sydney, Australia',
  'Singapore',
  'Amsterdam, Netherlands',
  'Stockholm, Sweden',
  'Austin, TX, USA',
  'Seattle, WA, USA',
  'Boston, MA, USA',
  'Chicago, IL, USA',
  'Barcelona, Spain',
  'Milan, Italy',
  'Dublin, Ireland',
  'Tel Aviv, Israel',
];