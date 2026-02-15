import { apiClient } from '@/lib/api-client';

export interface LocationSuggestion {
    place_id: string;
    formatted: string;
    name: string;
    country: string;
    region?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export const popularCities = [
    'San Francisco, CA, USA',
    'New York, NY, USA',
    'London, UK',
    'Berlin, Germany',
    'Singapore',
    'Bangalore, India',
    'Tel Aviv, Israel',
    'Toronto, Canada',
];

// Search for location suggestions
export const searchLocations = async (query: string): Promise<LocationSuggestion[]> => {
    if (!query || query.length < 2) {
        return [];
    }

    try {
        // Filter popular cities for demo
        const filtered = popularCities
            .filter(city => city.toLowerCase().includes(query.toLowerCase()))
            .map((city, index) => ({
                place_id: `city-${index}`,
                formatted: city,
                name: city.split(',')[0],
                country: city.split(',').pop()?.trim() || '',
            }));
        return filtered;
    } catch (error) {
        console.error('Location search error:', error);
        return [];
    }
};

// Get current location using browser geolocation API
export const getCurrentLocation = (): Promise<{ lat: number; lon: number }> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            reject
        );
    });
};

// Reverse geocode coordinates to location name
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
        // For demo purposes, return a mock location
        // In production, you would call a geocoding API
        return `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
    } catch (error) {
        console.error('Reverse geocode error:', error);
        return 'Unknown Location';
    }
};
