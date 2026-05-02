import { fetchBookingHotels, fetchAirbnbProperties } from './src/lib/additionalApis';

async function run() {
  console.log("Testing Booking Hotels...");
  try {
    const hotels = await fetchBookingHotels('London');
    console.log("Hotels:", hotels ? hotels.length : "null");
  } catch(e) { console.error("Hotels Error:", e); }

  console.log("Testing Airbnb Stays...");
  try {
    const stays = await fetchAirbnbProperties('London');
    console.log("Stays:", stays ? stays.length : "null");
  } catch(e) { console.error("Stays Error:", e); }
}
run();
