import { searchFlights } from './flightApi';

export interface Deal {
  id: string;
  from: string;
  to: string;
  flag: string;
  price: number;
  original: number;
  discount: number;
  departure: string;
  airlines: string[];
  expiresIn: number; // seconds
}

export interface PriceDrop {
  id: string;
  route: string;
  flag: string;
  drop: number; // percentage
  price: number;
}

const POPULAR_DESTINATIONS = [
  { code: 'BKK', city: 'Bangkok', flag: '🇹🇭' },
  { code: 'DXB', city: 'Dubai', flag: '🇦🇪' },
  { code: 'SIN', city: 'Singapore', flag: '🇸🇬' },
  { code: 'LHR', city: 'London', flag: '🇬🇧' },
];

export async function fetchLiveDeals(homeAirport: string = 'DEL'): Promise<{ flashSales: Deal[], priceDrops: PriceDrop[] }> {
  // In a real app, this would query the `live_deals` table in Supabase which is populated by CRON jobs.
  // For the frontend demo, we will fire 2 parallel API requests to generate real deals.
  
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14); // 2 weeks from now
  const dateStr = futureDate.toISOString().split('T')[0];

  const flashSales: Deal[] = [];
  const priceDrops: PriceDrop[] = [];

  try {
    // Pick 2 random destinations to avoid hammering the API
    const targets = POPULAR_DESTINATIONS.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    const results = await Promise.all(
      targets.map(dest => 
        searchFlights({
          fromCode: homeAirport,
          toCode: dest.code,
          departDate: dateStr,
          adults: 1,
          cabinClass: 'economy',
          currency: 'INR'
        }).then(flights => ({ dest, flights }))
      )
    );

    results.forEach(({ dest, flights }, index) => {
      if (flights && flights.length > 0 && flights[0].price > 0) {
        const bestFlight = flights[0];
        
        // Generate a synthetic "original" price to show a deal
        const discountPercentage = Math.floor(Math.random() * 20) + 15; // 15-35%
        const originalPrice = Math.floor(bestFlight.price * (1 + discountPercentage / 100));
        
        if (index === 0) {
          flashSales.push({
            id: bestFlight.id,
            from: homeAirport,
            to: dest.city,
            flag: dest.flag,
            price: bestFlight.price,
            original: originalPrice,
            discount: discountPercentage,
            departure: bestFlight.departureTime.split('T')[0],
            airlines: [bestFlight.airline],
            expiresIn: Math.floor(Math.random() * 36000) + 3600 // 1-10 hours
          });
        } else {
          priceDrops.push({
            id: bestFlight.id,
            route: `${homeAirport} → ${dest.city}`,
            flag: dest.flag,
            drop: discountPercentage,
            price: bestFlight.price
          });
        }
      }
    });

    return { flashSales, priceDrops };
  } catch (err) {
    console.error("Failed to fetch live deals:", err);
    return { flashSales: [], priceDrops: [] };
  }
}
