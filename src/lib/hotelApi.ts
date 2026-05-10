/**
 * Booking.com 15 API Wrapper
 * IMPORTANT: To monetize, append your Affiliate ID (AID) to all 'url' fields 
 * before presenting them to the user (e.g. &aid=YOUR_ID).
 */
import { API_CONFIG } from './flightApi';

const BASE_URL = 'https://booking-com15.p.rapidapi.com/api/v1';

export interface HotelSearchResult {
  hotel_id: string;
  hotel_name: string;
  main_photo_url: string;
  price_breakdown: {
    all_inclusive_amount: number;
    currency: string;
  };
  review_score: number;
  address: string;
  distance_from_city_center: string;
  url: string;
}

export async function searchHotels(params: {
  dest_id: string;
  search_type: 'CITY' | 'LATLONG';
  arrival_date: string;
  departure_date: string;
  adults: string;
  children_age?: string;
  room_qty: string;
}) {
  const queryParams = new URLSearchParams({
    dest_id: params.dest_id,
    search_type: params.search_type,
    arrival_date: params.arrival_date,
    departure_date: params.departure_date,
    adults: params.adults,
    room_qty: params.room_qty,
    page_number: '1',
    languagecode: 'en-us',
    currency_code: 'INR'
  });

  if (params.children_age) {
    queryParams.append('children_age', params.children_age);
  }

  try {
    const response = await fetch(`${BASE_URL}/hotels/searchHotels?${queryParams}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_CONFIG.KEY,
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch hotels');
    }

    const data = await response.json();
    
    if (data.status === false) {
      console.error('API Error:', data.message);
      return [];
    }

    if (!data.data || !data.data.hotels) return [];

    return data.data.hotels.map((h: any) => ({
      hotel_id: h.hotel_id,
      hotel_name: h.hotel_name,
      main_photo_url: h.main_photo_url,
      price: h.price_breakdown?.all_inclusive_amount || 0,
      currency: h.price_breakdown?.currency || 'INR',
      rating: h.review_score,
      address: h.address,
      distance: h.distance_from_city_center,
      url: h.url
    }));
  } catch (error) {
    console.error('Hotel Search Error:', error);
    return [];
  }
}

// Hardcoded fallbacks for major cities (Booking.com dest_ids)
const CITY_FALLBACKS: Record<string, { dest_id: string, search_type: string }> = {
  'hanoi': { dest_id: '-2633053', search_type: 'CITY' },
  'dubai': { dest_id: '-782831', search_type: 'CITY' },
  'london': { dest_id: '-2601889', search_type: 'CITY' },
  'paris': { dest_id: '-1456928', search_type: 'CITY' },
  'singapore': { dest_id: '-73635', search_type: 'CITY' },
  'new delhi': { dest_id: '-2106102', search_type: 'CITY' },
  'new york': { dest_id: '20088325', search_type: 'CITY' },
  'tokyo': { dest_id: '-246227', search_type: 'CITY' },
  'bangkok': { dest_id: '-3212344', search_type: 'CITY' },
  'mumbai': { dest_id: '-2092174', search_type: 'CITY' },
};

export async function resolveDestination(query: string) {
  if (!query) return null;
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check fallback first for reliability
  if (CITY_FALLBACKS[normalizedQuery]) {
    console.log(`[HotelAPI] Using fallback for: ${query}`);
    return CITY_FALLBACKS[normalizedQuery];
  }

  try {
    const response = await fetch(`${BASE_URL}/hotels/searchDestination?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_CONFIG.KEY,
        'x-rapidapi-host': 'booking-com15.p.rapidapi.com'
      }
    });

    if (!response.ok) throw new Error('Failed to resolve destination');

    const data = await response.json();
    
    if (data.status === false || !data.data || data.data.length === 0) {
      console.warn(`No destination found for: ${query}`);
      
      // Secondary fallback: Try to match a substring in our CITY_FALLBACKS
      const fallbackKey = Object.keys(CITY_FALLBACKS).find(k => normalizedQuery.includes(k) || k.includes(normalizedQuery));
      if (fallbackKey) return CITY_FALLBACKS[fallbackKey];
      
      return null;
    }

    // Logging for debugging
    console.log(`[HotelAPI] Found ${data.data.length} locations for "${query}"`);

    // Strategy:
    // 1. Look for exact city name match
    // 2. Look for search_type === 'CITY'
    // 3. Fallback to first result
    
    const exactMatch = data.data.find((d: any) => d.name?.toLowerCase() === normalizedQuery);
    if (exactMatch) return exactMatch;

    const cityResult = data.data.find((d: any) => d.search_type === 'CITY' || d.dest_type === 'city');
    return cityResult || data.data[0];
  } catch (error) {
    console.error('Destination Resolution Error:', error);
    // Final fallback attempt
    const fallbackKey = Object.keys(CITY_FALLBACKS).find(k => normalizedQuery.includes(k));
    return fallbackKey ? CITY_FALLBACKS[fallbackKey] : null;
  }
}
