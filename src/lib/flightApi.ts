const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '7626b7722emsh4b361da5bafaadcp14f4aejsndea0e27edaf3';
const RAPIDAPI_HOST = 'google-flights2.p.rapidapi.com';
const BASE_URL = 'https://google-flights2.p.rapidapi.com/api/v1';

const headers = {
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': RAPIDAPI_HOST,
};

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
  returnDate?: string;         // YYYY-MM-DD (for round trips)
  adults?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  currency?: string;
}

// Step 1: Search flights using Google Flights API
export async function searchFlights(params: SearchParams): Promise<FlightResult[]> {
  if (!RAPIDAPI_KEY) {
    console.error('[FlightAPI] VITE_RAPIDAPI_KEY not set in environment!');
    return [{
      id: 'error-key',
      price: 0,
      currency: 'USD',
      airline: 'ERROR: API KEY MISSING in environment',
      departureTime: params.departDate + 'T00:00:00',
      arrivalTime: params.departDate + 'T00:00:00',
      duration: '0h',
      stops: 0,
      stopDetails: 'Error',
      from: params.fromCode,
      to: params.toCode,
    }];
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
      currency: params.currency || 'USD',
      language_code: 'en-US',
      country_code: 'US',
    });

    if (params.returnDate) {
      queryParams.append('return_date', params.returnDate);
    }

    const res = await fetch(`${BASE_URL}/searchFlights?${queryParams}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return parseGoogleFlights(data, params);
  } catch (err: any) {
    console.error('[FlightAPI] searchFlights failed:', err);
    return [{
      id: 'error-flight',
      price: 0,
      currency: 'USD',
      airline: `API ERROR: ${err.message}`,
      departureTime: params.departDate + 'T00:00:00',
      arrivalTime: params.departDate + 'T00:00:00',
      duration: '0h',
      stops: 0,
      stopDetails: 'Error',
      from: params.fromCode,
      to: params.toCode,
    }];
  }
}

function parseGoogleFlights(data: any, params: SearchParams): FlightResult[] {
  try {
    const itineraries = data?.data?.itineraries || {};
    const allFlights = [...(itineraries.topFlights || []), ...(itineraries.otherFlights || [])];

    if (allFlights.length === 0) return [];

    return allFlights.map((item: any, idx: number) => {
      // time format: "2026-5-27 07:20"
      const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const parts = timeStr.split(' ');
        if (parts.length !== 2) return timeStr;
        const [datePart, timePart] = parts;
        const formattedDate = datePart.split('-').map(p => p.padStart(2, '0')).join('-');
        return `${formattedDate}T${timePart}:00`;
      };

      const firstFlight = item.flights?.[0];
      const flightsLen = item.flights?.length || 0;
      const lastFlight = flightsLen > 0 ? item.flights[flightsLen - 1] : undefined;
      const mainAirline = firstFlight?.airline || 'Unknown Airline';

      return {
        id: item.booking_token || `flight-${idx}`,
        price: item.price || 0,
        currency: params.currency || 'USD',
        airline: mainAirline,
        airlineLogo: item.airline_logo || firstFlight?.airline_logo,
        departureTime: formatTime(firstFlight?.departure_airport?.time),
        arrivalTime: formatTime(lastFlight?.arrival_airport?.time),
        duration: item.duration?.text || '',
        stops: item.stops || 0,
        stopDetails: item.stops > 0 ? `${item.stops} stop${item.stops > 1 ? 's' : ''}` : 'Direct',
        from: params.fromCode,
        to: params.toCode,
        raw: item,
      } as FlightResult;
    });
  } catch (err: any) {
    console.error('[FlightAPI] parseGoogleFlights failed:', err);
    return [{
      id: 'error-parse',
      price: 0,
      currency: 'USD',
      airline: `PARSE ERROR: ${err.message}`,
      departureTime: params.departDate + 'T00:00:00',
      arrivalTime: params.departDate + 'T00:00:00',
      duration: '0h',
      stops: 0,
      stopDetails: 'Error',
      from: params.fromCode,
      to: params.toCode,
    }];
  }
}

// Removed mock flights to force real errors.

export async function searchAirportsByQuery(_query: string): Promise<any[]> {
  // Since Google Flights natively supports IATA, we don't need to resolve EntityIDs anymore.
  // We can just rely on our offline AIRPORTS database for the Search bar autocomplete!
  return [];
}
