import { searchFlights } from './src/lib/flightApi';

(globalThis as any).import = { meta: { env: { VITE_RAPIDAPI_KEY: '7626b7722emsh4b361da5bafaadcp14f4aejsndea0e27edaf3' } } };

async function run() {
  const params = {
    fromCode: 'DEL',
    toCode: 'LHR',
    departDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    passengers: 1,
    cabinClass: 'economy' as any,
    tripType: 'round-trip'
  };
  
  console.log("Calling searchFlights with:", params);
  try {
    const flights = await searchFlights(params);
    console.log('Result length:', flights.length);
    if (flights.length > 0) {
      console.log('First flight ID:', flights[0].id);
      console.log('First flight price:', flights[0].price);
      console.log('First flight mock?:', flights[0].id.includes('mock'));
    }
  } catch (err) {
    console.error("Caught error:", err);
  }
}
run();
