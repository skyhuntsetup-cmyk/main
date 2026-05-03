const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '7626b7722emsh4b361da5bafaadcp14f4aejsndea0e27edaf3';
const RAPIDAPI_HOST = 'google-flights2.p.rapidapi.com';
const BASE_URL = 'https://google-flights2.p.rapidapi.com/api/v1';

const headers = {
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': RAPIDAPI_HOST,
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
      children: String(params.children ?? 0),
      infants_on_lap: String(params.infants ?? 0),
      travel_class: cabinMap[params.cabinClass || 'economy'],
      currency: params.currency || 'INR',
      language_code: 'en-IN',
      country_code: 'IN',
      search_type: params.searchType || 'best',
    });

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
    const itineraries = data?.data?.itineraries || {};
    // Merge best and other flights, marking the best ones
    const topFlights = (itineraries.topFlights || []).map((f: any) => ({ ...f, _isBest: true }));
    const otherFlights = (itineraries.otherFlights || []).map((f: any) => ({ ...f, _isBest: false }));
    const allFlights = [...topFlights, ...otherFlights];

    if (allFlights.length === 0) {
      console.warn('[FlightAPI] No flights found in response. Raw data:', JSON.stringify(data).slice(0, 500));
      return [];
    }

    return allFlights.map((item: any, idx: number) => {
      const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const parts = timeStr.split(' ');
        if (parts.length !== 2) return timeStr;
        const [datePart, timePart] = parts;
        const formattedDate = datePart.split('-').map(p => p.padStart(2, '0')).join('-');
        return `${formattedDate}T${timePart}:00`;
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
        segments,
        raw: item,
      } as FlightResult;
    });
  } catch (err: any) {
    console.error('[FlightAPI] parseGoogleFlights failed:', err);
    return [];
  }
}

// Removed mock flights to force real errors.

export async function searchAirportsByQuery(_query: string): Promise<any[]> {
  // Since Google Flights natively supports IATA, we don't need to resolve EntityIDs anymore.
  // We can just rely on our offline AIRPORTS database for the Search bar autocomplete!
  return [];
}
