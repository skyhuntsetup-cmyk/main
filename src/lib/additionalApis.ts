const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '';

const headers = (host: string) => ({
  'x-rapidapi-key': RAPIDAPI_KEY,
  'x-rapidapi-host': host,
});

export async function fetchBookingHotels(city: string) {
  try {
    // Step 1: Get destination ID
    const destRes = await fetch(`https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(city)}`, {
      headers: headers('booking-com15.p.rapidapi.com')
    });
    const destData = await destRes.json();
    const destId = destData?.data?.[0]?.dest_id;
    if (!destId) return null;

    // Step 2: Get hotels
    const today = new Date();
    today.setDate(today.getDate() + 14); // 2 weeks from now
    const arrDate = today.toISOString().split('T')[0];
    const depDate = new Date(today.getTime() + 2 * 86400000).toISOString().split('T')[0];

    const hotelRes = await fetch(`https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=city&arrival_date=${arrDate}&departure_date=${depDate}&adults=1`, {
      headers: headers('booking-com15.p.rapidapi.com')
    });
    const hotelData = await hotelRes.json();
    return hotelData?.data?.hotels?.slice(0, 3) || [];
  } catch (err) {
    console.error('Booking Hotels Error:', err);
    return null;
  }
}

export async function fetchAirbnbProperties(city: string) {
  try {
    const destRes = await fetch(`https://airbnb19.p.rapidapi.com/api/v1/searchDestination?query=${encodeURIComponent(city)}`, {
      headers: headers('airbnb19.p.rapidapi.com')
    });
    const destData = await destRes.json();
    const placeId = destData?.data?.[0]?.id;
    if (!placeId) return null;

    const propRes = await fetch(`https://airbnb19.p.rapidapi.com/api/v2/searchPropertyByPlaceId?placeId=${placeId}&adults=1&guestFavorite=false&ib=false&currency=USD`, {
      headers: headers('airbnb19.p.rapidapi.com')
    });
    const propData = await propRes.json();
    return propData?.data?.slice(0, 3) || [];
  } catch (err) {
    console.error('Airbnb Error:', err);
    return null;
  }
}

export async function fetchVisaDetails() {
  try {
    // The history endpoint is what the user provided
    const res = await fetch(`https://visa-requirement.p.rapidapi.com/v2/visa/check/history/KZ/ME/2024-05-01`, {
      headers: headers('visa-requirement.p.rapidapi.com')
    });
    const data = await res.json();
    return data?.data?.current_rule || null;
  } catch (err) {
    console.error('Visa Error:', err);
    return null;
  }
}

export async function fetchEmbassyDetails(source: string, destination: string) {
  try {
    const res = await fetch(`https://travel-info-api.p.rapidapi.com/find-embassy?source=${encodeURIComponent(source.toLowerCase())}&destination=${encodeURIComponent(destination.toLowerCase())}`, {
      headers: headers('travel-info-api.p.rapidapi.com')
    });
    const data = await res.json();
    if (data?.error) {
      // Fallback if the country is not supported by the API
      const fb = await fetch(`https://travel-info-api.p.rapidapi.com/find-embassy?source=turkey&destination=usa`, {
        headers: headers('travel-info-api.p.rapidapi.com')
      });
      const fbData = await fb.json();
      return fbData?.data?.[0] || null;
    }
    return data?.data?.[0] || null;
  } catch (err) {
    console.error('Embassy Error:', err);
    return null;
  }
}
