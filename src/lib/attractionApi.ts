import { API_CONFIG } from './flightApi';

const BASE_URL = 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant';

export async function searchRestaurants(locationId: string) {
  try {
    const response = await fetch(`${BASE_URL}/searchRestaurants?locationId=${locationId}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_CONFIG.KEY,
        'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com'
      }
    });

    if (!response.ok) throw new Error('Failed to fetch restaurants');

    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.error('TripAdvisor API Error:', error);
    return [];
  }
}

export async function getLocationId(query: string) {
  try {
    const response = await fetch(`https://tripadvisor16.p.rapidapi.com/api/v1/hotels/searchLocation?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_CONFIG.KEY,
        'x-rapidapi-host': 'tripadvisor16.p.rapidapi.com'
      }
    });

    if (!response.ok) throw new Error('Failed to resolve location');

    const data = await response.json();
    return data.data?.[0]?.locationId;
  } catch (error) {
    console.error('Location Resolution Error:', error);
    return null;
  }
}
