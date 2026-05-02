import { searchFlights } from './src/lib/flightApi';

async function test() {
  const flights = await searchFlights({
    fromCode: 'DEL',
    toCode: 'BOM',
    fromEntityId: '95673498',
    toEntityId: '27539520',
    departDate: '2026-05-27',
    adults: 1,
    cabinClass: 'economy',
    currency: 'INR'
  });
  console.log(flights.slice(0, 2));
}

test();
