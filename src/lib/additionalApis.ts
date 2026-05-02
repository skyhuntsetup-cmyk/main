const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '7626b7722emsh4b361da5bafaadcp14f4aejsndea0e27edaf3';

const headers = (host: string) => ({
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': host,
});

// Map country names (as stored in airports.ts) to ISO 3166-1 alpha-2 codes
// used by the visa-requirement API
const COUNTRY_TO_ISO2: Record<string, string> = {
  'India': 'IN',
  'United States': 'US',
  'USA': 'US',
  'United Kingdom': 'GB',
  'UK': 'GB',
  'United Arab Emirates': 'AE',
  'UAE': 'AE',
  'Singapore': 'SG',
  'Japan': 'JP',
  'Australia': 'AU',
  'France': 'FR',
  'Germany': 'DE',
  'Thailand': 'TH',
  'Malaysia': 'MY',
  'Canada': 'CA',
  'China': 'CN',
  'Hong Kong': 'HK',
  'South Korea': 'KR',
  'Italy': 'IT',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Switzerland': 'CH',
  'Turkey': 'TR',
  'Russia': 'RU',
  'Brazil': 'BR',
  'South Africa': 'ZA',
  'Egypt': 'EG',
  'Kenya': 'KE',
  'Indonesia': 'ID',
  'Philippines': 'PH',
  'Vietnam': 'VN',
  'New Zealand': 'NZ',
  'Qatar': 'QA',
  'Saudi Arabia': 'SA',
  'Kuwait': 'KW',
  'Bahrain': 'BH',
  'Oman': 'OM',
  'Nepal': 'NP',
  'Sri Lanka': 'LK',
  'Bangladesh': 'BD',
  'Pakistan': 'PK',
  'Mexico': 'MX',
  'Portugal': 'PT',
  'Greece': 'GR',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Poland': 'PL',
  'Czech Republic': 'CZ',
  'Austria': 'AT',
  'Belgium': 'BE',
  'Ireland': 'IE',
  'Romania': 'RO',
  'Hungary': 'HU',
  'Croatia': 'HR',
  'Serbia': 'RS',
  'Ukraine': 'UA',
  'Morocco': 'MA',
  'Ethiopia': 'ET',
  'Tanzania': 'TZ',
  'Ghana': 'GH',
  'Nigeria': 'NG',
  'Argentina': 'AR',
  'Colombia': 'CO',
  'Peru': 'PE',
  'Chile': 'CL',
};

function toISO2(countryName: string): string {
  return COUNTRY_TO_ISO2[countryName] || countryName.substring(0, 2).toUpperCase();
}

// ─── Booking.com Hotels ──────────────────────────────────────────────────────

export async function fetchBookingHotels(city: string, arrivalDate?: string, departureDate?: string) {
  try {
    // Step 1: Resolve destination ID — prefer dest_type=city for accurate hotel results
    const destRes = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(city)}`,
      { headers: headers('booking-com15.p.rapidapi.com') }
    );
    const destData = await destRes.json();
    const results: any[] = destData?.data || [];
    const cityResult = results.find((r: any) => r.dest_type === 'city') || results[0];
    const destId = cityResult?.dest_id;
    const searchType = cityResult?.dest_type || 'city';
    if (!destId) return null;

    // Step 2: Use the user's actual travel dates; fall back to 14 days out if not provided
    const today = new Date();
    const defaultArrival = new Date(today.getTime() + 14 * 86400000).toISOString().split('T')[0];
    const defaultDeparture = new Date(today.getTime() + 16 * 86400000).toISOString().split('T')[0];

    const arrDate = arrivalDate || defaultArrival;
    const depDate = departureDate || defaultDeparture;

    const hotelRes = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=${searchType}&arrival_date=${arrDate}&departure_date=${depDate}&adults=1&room_qty=1&page_number=1`,
      { headers: headers('booking-com15.p.rapidapi.com') }
    );
    const hotelData = await hotelRes.json();
    return hotelData?.data?.hotels?.slice(0, 3) || [];
  } catch (err) {
    console.error('[Booking] fetchBookingHotels error:', err);
    return null;
  }
}

// ─── Airbnb ──────────────────────────────────────────────────────────────────

export async function fetchAirbnbProperties(city: string, checkin?: string, checkout?: string) {
  try {
    // Step 1: Resolve place ID
    const destRes = await fetch(
      `https://airbnb19.p.rapidapi.com/api/v1/searchDestination?query=${encodeURIComponent(city)}`,
      { headers: headers('airbnb19.p.rapidapi.com') }
    );
    const destData = await destRes.json();
    const placeId = destData?.data?.[0]?.id;
    if (!placeId) return null;

    // Step 2: Search properties — include checkin/checkout when available
    const dateParams = checkin && checkout
      ? `&checkin=${checkin}&checkout=${checkout}`
      : '';

    const propRes = await fetch(
      `https://airbnb19.p.rapidapi.com/api/v2/searchPropertyByPlaceId?placeId=${placeId}&adults=1&guestFavorite=false&ib=false&currency=USD${dateParams}`,
      { headers: headers('airbnb19.p.rapidapi.com') }
    );
    const propData = await propRes.json();
    return propData?.data?.slice(0, 3) || [];
  } catch (err) {
    console.error('[Airbnb] fetchAirbnbProperties error:', err);
    return null;
  }
}

// ─── Visa Requirements ───────────────────────────────────────────────────────

export async function fetchVisaDetails(fromCountry?: string, toCountry?: string, travelDate?: string) {
  try {
    const from = toISO2(fromCountry || 'India');
    const to   = toISO2(toCountry   || 'United States');
    // Use the travel date if provided, otherwise today's date
    const date = travelDate || new Date().toISOString().split('T')[0];

    const res = await fetch(
      `https://visa-requirement.p.rapidapi.com/v2/visa/check/history/${from}/${to}/${date}`,
      { headers: headers('visa-requirement.p.rapidapi.com') }
    );
    const data = await res.json();
    return data?.data?.current_rule || null;
  } catch (err) {
    console.error('[Visa] fetchVisaDetails error:', err);
    return null;
  }
}

// ─── Embassy Lookup ──────────────────────────────────────────────────────────

export async function fetchEmbassyDetails(source: string, destination: string) {
  try {
    const src  = encodeURIComponent(source.toLowerCase());
    const dest = encodeURIComponent(destination.toLowerCase());

    const res = await fetch(
      `https://travel-info-api.p.rapidapi.com/find-embassy?source=${src}&destination=${dest}`,
      { headers: headers('travel-info-api.p.rapidapi.com') }
    );
    const data = await res.json();
    if (data?.error || !data?.data?.[0]) return null;
    return data.data[0];
  } catch (err) {
    console.error('[Embassy] fetchEmbassyDetails error:', err);
    return null;
  }
}
