// Flight Search Service — Sky Scrapper API (RapidAPI)
// Docs: https://rapidapi.com/apiheya/api/sky-scrapper

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '';
const RAPIDAPI_HOST = 'sky-scrapper.p.rapidapi.com';
const BASE_URL = 'https://sky-scrapper.p.rapidapi.com/api';

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
  departDate: string;          // YYYY-MM-DD
  returnDate?: string;         // YYYY-MM-DD (for round trips)
  adults?: number;
  cabinClass?: 'economy' | 'premium_economy' | 'business' | 'first';
  currency?: string;
}

// Step 1: Get Skyscanner entityId for an IATA code
export async function getSkyId(iataCode: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${BASE_URL}/v1/flights/searchAirport?query=${iataCode}&locale=en-US`,
      { headers }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const airport = data?.data?.[0];
    return airport?.entityId || null;
  } catch (err) {
    console.error('[FlightAPI] getSkyId failed:', err);
    return null;
  }
}

// Step 2: Search flights
export async function searchFlights(params: SearchParams): Promise<FlightResult[]> {
  if (!RAPIDAPI_KEY) {
    console.warn('[FlightAPI] VITE_RAPIDAPI_KEY not set — using mock data');
    return getMockFlights(params);
  }

  try {
    // Use provided entity IDs or fetch them sequentially to avoid rate limits
    let fromEntity: string | null | undefined = params.fromEntityId;
    if (!fromEntity) {
      fromEntity = await getSkyId(params.fromCode);
    }
    
    let toEntity: string | null | undefined = params.toEntityId;
    if (!toEntity) {
      toEntity = await getSkyId(params.toCode);
    }

    if (!fromEntity || !toEntity) {
      console.warn('[FlightAPI] Could not resolve airport entity IDs');
      return getMockFlights(params);
    }

    const cabinMap: Record<string, string> = {
      economy: 'economy',
      premium_economy: 'premiumeconomy',
      business: 'business',
      first: 'first',
    };

    const queryParams = new URLSearchParams({
      originSkyId: params.fromCode,
      destinationSkyId: params.toCode,
      originEntityId: fromEntity,
      destinationEntityId: toEntity,
      date: params.departDate,
      adults: String(params.adults || 1),
      cabinClass: cabinMap[params.cabinClass || 'economy'],
      currency: params.currency || 'USD',
      market: 'IN',
      countryCode: 'IN',
      locale: 'en-US',
    });

    if (params.returnDate) {
      queryParams.append('returnDate', params.returnDate);
    }

    const endpoint = params.returnDate
      ? `${BASE_URL}/v2/flights/searchFlights`
      : `${BASE_URL}/v2/flights/searchFlights`;

    const res = await fetch(`${endpoint}?${queryParams}`, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    return parseFlightResults(data, params);
  } catch (err) {
    console.error('[FlightAPI] searchFlights failed:', err);
    return getMockFlights(params);
  }
}

// Parse Sky Scrapper response into our FlightResult format
function parseFlightResults(data: any, params: SearchParams): FlightResult[] {
  try {
    const itineraries = data?.data?.itineraries || [];
    return itineraries.slice(0, 20).map((item: any, idx: number) => {
      const leg = item.legs?.[0];
      const segment = leg?.segments?.[0];
      const price = item.price?.raw || item.price?.formatted?.replace(/[^0-9.]/g, '') || 0;

      return {
        id: item.id || `flight-${idx}`,
        price: typeof price === 'string' ? parseFloat(price) : price,
        currency: params.currency || 'USD',
        airline: segment?.operatingCarrier?.name || leg?.carriers?.marketing?.[0]?.name || 'Unknown Airline',
        airlineLogo: leg?.carriers?.marketing?.[0]?.logoUrl,
        departureTime: leg?.departure || '',
        arrivalTime: leg?.arrival || '',
        duration: formatDuration(leg?.durationInMinutes),
        stops: (leg?.stopCount || 0),
        stopDetails: leg?.stopCount > 0 ? `${leg.stopCount} stop${leg.stopCount > 1 ? 's' : ''}` : 'Direct',
        from: params.fromCode,
        to: params.toCode,
        raw: item,
      } as FlightResult;
    });
  } catch (err) {
    console.error('[FlightAPI] parseFlightResults failed:', err);
    return getMockFlights(params);
  }
}

function formatDuration(minutes: number): string {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

// Mock data for when API key is not configured
export function getMockFlights(params: SearchParams): FlightResult[] {
  return [
    {
      id: 'mock-1',
      price: 42500,
      currency: 'INR',
      airline: 'Air India',
      departureTime: `${params.departDate}T06:30:00`,
      arrivalTime: `${params.departDate}T10:45:00`,
      duration: '4h 15m',
      stops: 0,
      stopDetails: 'Direct',
      from: params.fromCode,
      to: params.toCode,
    },
    {
      id: 'mock-2',
      price: 38900,
      currency: 'INR',
      airline: 'IndiGo',
      departureTime: `${params.departDate}T09:15:00`,
      arrivalTime: `${params.departDate}T14:30:00`,
      duration: '5h 15m',
      stops: 1,
      stopDetails: '1 stop',
      from: params.fromCode,
      to: params.toCode,
    },
    {
      id: 'mock-3',
      price: 55200,
      currency: 'INR',
      airline: 'Emirates',
      departureTime: `${params.departDate}T23:55:00`,
      arrivalTime: `${params.departDate}T04:20:00+1`,
      duration: '8h 25m',
      stops: 1,
      stopDetails: '1 stop via DXB',
      from: params.fromCode,
      to: params.toCode,
    },
    {
      id: 'mock-4',
      price: 61000,
      currency: 'INR',
      airline: 'British Airways',
      departureTime: `${params.departDate}T14:20:00`,
      arrivalTime: `${params.departDate}T19:00:00`,
      duration: '9h 40m',
      stops: 0,
      stopDetails: 'Direct',
      from: params.fromCode,
      to: params.toCode,
    },
    {
      id: 'mock-5',
      price: 35600,
      currency: 'INR',
      airline: 'SpiceJet',
      departureTime: `${params.departDate}T11:45:00`,
      arrivalTime: `${params.departDate}T18:30:00`,
      duration: '6h 45m',
      stops: 1,
      stopDetails: '1 stop',
      from: params.fromCode,
      to: params.toCode,
    },
  ];
}

// Step 3: Search Airports
export async function searchAirportsByQuery(query: string): Promise<any[]> {
  if (!RAPIDAPI_KEY || !query) return [];
  try {
    const res = await fetch(
      `${BASE_URL}/v1/flights/searchAirport?query=${encodeURIComponent(query)}&locale=en-US`,
      { headers }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data?.data || [];
  } catch (err) {
    console.error('[FlightAPI] searchAirportsByQuery failed:', err);
    return [];
  }
}
