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
    currency_code: 'USD'
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

    if (!response.ok) throw new Error('Failed to fetch hotels');

    const data = await response.json();
    
    if (data.status === false) {
      console.error('API Error:', data.message);
      return [];
    }

    return data.data.hotels.map((h: any) => ({
      hotel_id: h.hotel_id,
      hotel_name: h.hotel_name,
      main_photo_url: h.main_photo_url,
      price: h.price_breakdown?.all_inclusive_amount || 0,
      currency: h.price_breakdown?.currency || 'USD',
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

export async function resolveDestination(query: string) {
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
    return data.data?.[0]; // Returns { dest_id, dest_type, search_type, ... }
  } catch (error) {
    console.error('Destination Resolution Error:', error);
    return null;
  }
}
