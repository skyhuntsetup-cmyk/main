/**
 * Google Flights 2 API Wrapper
 * MONETIZATION: Use the 'deeplink' field for direct affiliate conversions.
 */
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '7626b7722emsh4b361da5bafaadcp14f4aejsndea0e27edaf3';
const RAPIDAPI_HOST = 'google-flights2.p.rapidapi.com';
const BASE_URL = 'https://google-flights2.p.rapidapi.com/api/v1';

const headers = {
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': RAPIDAPI_HOST,
};

export const API_CONFIG = {
  KEY: RAPIDAPI_KEY,
};

export interface FlightSegment {
  airline: string;
  airlineLogo?: string;
  flightNumber?: string;
  aircraft?: string;
  departure: {
    airport: string;
    code: string;
    time: string;
  };
  arrival: {
    airport: string;
    code: string;
    time: string;
  };
  duration?: string;
}

export interface FlightResult {
  id: string;
  price: number;
  currency: string;
  airline: string;
  airlineLogo?: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopDetails?: string;
  from: string;
  to: string;
  bookingUrl?: string;
  flightNumber?: string;
  aircraft?: string;
  isBest?: boolean;
  reliabilityScore?: number;
  segments: FlightSegment[];
  raw?: any;
}

export interface SearchParams {
  fromCode: string;
  toCode: string;
  fromEntityId?: string;
  toEntityId?: string;
  fromCity?: string;
  toCity?: string;
  departDate: string;          // YYYY-MM-DD
  returnDate?: string;         // YYYY-MM-DD
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  currency?: string;
  searchType?: 'best' | 'cheap';
}

// Step 1: Search flights using Google Flights API
export async function searchFlights(params: SearchParams): Promise<FlightResult[]> {
  if (!RAPIDAPI_KEY) {
    console.error('[FlightAPI] VITE_RAPIDAPI_KEY not set!');
    return [];
  }

  try {
    const cabinMap: Record<string, string> = {
      economy: 'ECONOMY',
      premium_economy: 'PREMIUM_ECONOMY',
      business: 'BUSINESS',
      first: 'FIRST',
    };

    const queryParams = new URLSearchParams({
      departure_id: params.fromCode,
      arrival_id: params.toCode,
      outbound_date: params.departDate,
      adults: String(params.adults ?? 1),
      travel_class: cabinMap[params.cabinClass || 'economy'],
      currency: params.currency || 'INR',
      language_code: 'en-US', // Standardized
      country_code: 'IN',
      search_type: params.searchType || 'best',
    });

    if (params.children && params.children > 0) {
      queryParams.append('children', String(params.children));
    }
    if (params.infants && params.infants > 0) {
      queryParams.append('infants_on_lap', String(params.infants));
    }

    if (params.returnDate) {
      queryParams.append('return_date', params.returnDate);
    }

    console.log('[FlightAPI] Requesting:', `${BASE_URL}/searchFlights?${queryParams}`);
    const res = await fetch(`${BASE_URL}/searchFlights?${queryParams}`, { headers });
    if (!res.ok) {
      console.error(`[FlightAPI] HTTP Error ${res.status}:`, await res.text());
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    console.log('[FlightAPI] Response data:', data);
    return parseGoogleFlights(data, params);
  } catch (err: any) {
    console.error('[FlightAPI] searchFlights failed:', err);
    return [];
  }
}

function parseGoogleFlights(data: any, params: SearchParams): FlightResult[] {
  try {
    if (data?.status === false) {
      console.error('[FlightAPI] API returned status:false. Message:', data.message);
      return [];
    }
    const itineraries = data?.data?.itineraries || {};
    // Merge best and other flights, marking the best ones
    // Note: API might return snake_case or camelCase depending on version/provider
    const topFlights = (itineraries.top_flights || itineraries.topFlights || []).map((f: any) => ({ ...f, _isBest: true }));
    const otherFlights = (itineraries.other_flights || itineraries.otherFlights || []).map((f: any) => ({ ...f, _isBest: false }));
    const allFlights = [...topFlights, ...otherFlights];

    if (allFlights.length === 0) {
      console.warn('[FlightAPI] No flights found in response. Raw data:', JSON.stringify(data).slice(0, 500));
      return [];
    }

    return allFlights.map((item: any, idx: number) => {
      const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        
        // Handle common API formats
        // 1. "YYYY-MM-DD HH:MM" or "DD-MM-YYYY HH:MM"
        const parts = timeStr.split(' ');
        if (parts.length === 2) {
          const [datePart, timePart] = parts;
          const dateUnits = datePart.split(/[-/]/);
          
          if (dateUnits.length === 3) {
            // Check if it's YYYY-MM-DD or DD-MM-YYYY
            let y, m, d;
            if (dateUnits[0].length === 4) {
              [y, m, d] = dateUnits;
            } else {
              [d, m, y] = dateUnits;
            }
            return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T${timePart}:00`;
          }
        }
        
        // If it's just "HH:MM", keep it as is
        if (/^\d{1,2}:\d{2}$/.test(timeStr)) return timeStr;
        
        return timeStr;
      };

      const flights = item.flights || [];
      const firstFlight = flights[0];
      const lastFlight = flights[flights.length - 1];
      const mainAirline = firstFlight?.airline || 'Unknown Airline';
      const realStops = Math.max(0, flights.length - 1);

      const segments: FlightSegment[] = flights.map((f: any) => ({
        airline: f.airline,
        airlineLogo: f.airline_logo,
        flightNumber: f.flight_number,
        aircraft: f.aircraft,
        departure: {
          airport: f.departure_airport?.name,
          code: f.departure_airport?.id,
          time: formatTime(f.departure_airport?.time),
        },
        arrival: {
          airport: f.arrival_airport?.name,
          code: f.arrival_airport?.id,
          time: formatTime(f.arrival_airport?.time),
        },
        duration: f.duration?.text,
      }));

      return {
        id: item.booking_token || `flight-${idx}`,
        price: item.price || 0,
        currency: params.currency || 'INR',
        airline: mainAirline,
        airlineLogo: item.airline_logo || firstFlight?.airline_logo,
        departureTime: formatTime(firstFlight?.departure_airport?.time),
        arrivalTime: formatTime(lastFlight?.arrival_airport?.time),
        duration: item.duration?.text || '',
        stops: realStops,
        stopDetails: realStops > 0 ? `${realStops} stop${realStops > 1 ? 's' : ''}` : 'Direct',
        from: params.fromCode,
        to: params.toCode,
        bookingUrl: item.deeplink || `https://www.google.com/travel/flights?q=Flights%20to%20${params.toCode}%20from%20${params.fromCode}%20on%20${params.departDate}%20one%20way`,
        flightNumber: firstFlight?.flight_number,
        aircraft: firstFlight?.aircraft,
        isBest: item._isBest,
        reliabilityScore: getAirlineReliability(mainAirline),
        segments,
        raw: item,
      } as FlightResult;
    });
  } catch (err: any) {
    console.error('[FlightAPI] parseGoogleFlights failed:', err);
    return [];
  }
}

export async function getBookingUrl(token: string): Promise<string | null> {
  try {
    const response = await fetch(`${BASE_URL}/getBookingUrl?token=${encodeURIComponent(token)}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch booking URL');
    const data = await response.json();
    return data.data?.booking_url || null;
  } catch (error) {
    console.error('[FlightAPI] getBookingUrl failed:', error);
    return null;
  }
}

export async function searchAirportsByQuery(_query: string): Promise<any[]> {
  // Since Google Flights natively supports IATA, we don't need to resolve EntityIDs anymore.
  // We can just rely on our offline AIRPORTS database for the Search bar autocomplete!
  return [];
}

// Helper to generate a realistic reliability score based on the airline
function getAirlineReliability(airline: string): number {
  if (!airline) return 85;
  const name = airline.toLowerCase();
  
  if (name.includes('emirates') || name.includes('qatar') || name.includes('singapore')) return 96 + Math.floor(Math.random() * 4); // 96-99
  if (name.includes('lufthansa') || name.includes('ana') || name.includes('japan airlines')) return 92 + Math.floor(Math.random() * 5); // 92-96
  if (name.includes('indigo')) return 88 + Math.floor(Math.random() * 5); // 88-92
  if (name.includes('air india') || name.includes('spicejet')) return 70 + Math.floor(Math.random() * 10); // 70-79
  if (name.includes('ryanair') || name.includes('easyjet') || name.includes('spirit')) return 65 + Math.floor(Math.random() * 10); // 65-74
  
  // Default to a somewhat random score between 80 and 95
  return 80 + Math.floor(Math.random() * 16);
}
