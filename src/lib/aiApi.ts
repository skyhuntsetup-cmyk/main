export async function generateItinerary(params: {
  destination: string;
  nationality: string;
  sourceCountry: string;
  dates: string;
  duration: string;
  preferences: string;
  budget: string;
  extraContext?: string;
}) {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[aiApi] Supabase env vars missing — using mock data');
    return getMockItinerary(params);
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/itinerary-generator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ params }),
    });

    const text = await response.text();

    // Log for debugging
    console.log('[aiApi] HTTP Status:', response.status);
    console.log('[aiApi] Raw response (first 300):', text.substring(0, 300));

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Non-JSON response from Edge Function: ${text.substring(0, 200)}`);
    }

    if (!response.ok || data?.error) {
      throw new Error(data?.error || `Edge Function returned ${response.status}`);
    }

    // Validate the response has the expected new schema
    if (!data.destination || !data.itinerary) {
      console.error('[aiApi] Unexpected schema:', JSON.stringify(data).substring(0, 300));
      throw new Error('AI returned an unexpected format. Please try again.');
    }

    return data;
  } catch (error: any) {
    console.error('[aiApi] generateItinerary failed:', error.message);
    throw error;
  }
}

function getMockItinerary(params: any) {
  const dest = params.destination || 'Your Destination';
  const numDays = parseInt((params.duration || '5 Days').match(/\d+/)?.[0] || '5');

  const days = Array.from({ length: numDays }, (_, i) => ({
    day: i + 1,
    theme: i === 0 ? 'Arrival & City Orientation' : i === 1 ? 'Culture & History' : i === 2 ? 'Food & Markets' : i === 3 ? 'Day Trip & Nature' : 'Leisure & Departure',
    area: `Central ${dest} District`,
    morning: 'Check into hotel and explore the main square. Visit the central landmark.',
    afternoon: 'Tour the famous local museum or historic site.',
    evening: 'Dinner at a well-reviewed local restaurant in the old quarter.',
    transit: 'Metro or local taxi recommended.',
    insiderTip: 'Visit early morning to avoid tourist crowds.',
  }));

  return {
    destination: dest,
    tripSummary: `A ${numDays}-day journey through ${dest} tailored for ${params.nationality} travellers. Expect a perfect mix of culture, food, and adventure.`,
    visa: {
      status: 'e-Visa',
      cost: 'USD 25 (approx ₹2,100)',
      processingTime: '3-5 business days',
      validity: '30 days single entry',
      requirements: ['Valid passport (6+ months)', 'Return flight ticket', 'Hotel confirmation', 'Travel insurance'],
      proTip: 'Apply at least 2 weeks in advance via the official government portal to avoid third-party fees.',
    },
    weather: {
      summary: 'Pleasant weather expected during your dates.',
      temperature: '22°C – 30°C',
      conditions: 'Mostly sunny with occasional light showers.',
      packingList: ['Lightweight clothing', 'Sunscreen SPF 50', 'Comfortable walking shoes', 'Light jacket for evenings'],
      avoidItems: ['Heavy coats', 'Formal shoes'],
    },
    itinerary: days,
    food: {
      mustTryDishes: [
        { name: 'Local Specialty 1', description: 'A signature dish unique to this region', whereToTry: 'Famous Local Restaurant' },
        { name: 'Street Snack', description: 'Popular street food found in every market', whereToTry: 'Central Market' },
        { name: 'Traditional Breakfast', description: 'How locals start their day', whereToTry: 'Neighbourhood Café' },
        { name: 'Dessert Specialty', description: 'The city\'s most loved sweet treat', whereToTry: 'Old Quarter Sweets Shop' },
      ],
      topRestaurants: [
        { name: 'The Grand Restaurant', cuisine: 'Local', priceRange: '₹₹', knownFor: 'Traditional cuisine', area: 'City Centre' },
        { name: 'Rooftop Bistro', cuisine: 'Fusion', priceRange: '₹₹₹', knownFor: 'City views', area: 'Old Quarter' },
        { name: 'Market Kitchen', cuisine: 'Local', priceRange: '₹', knownFor: 'Fresh ingredients', area: 'Central Market' },
        { name: 'Heritage Dining Hall', cuisine: 'Traditional', priceRange: '₹₹', knownFor: 'Authentic recipes', area: 'Historic District' },
      ],
      streetFoodSpots: ['Central Night Market — try everything grilled', 'Old Quarter Street — best local snacks'],
    },
    budget: {
      dailyEstimate: '₹3,000 – ₹5,000 per day (excluding flights)',
      flightEstimate: `₹20,000 – ₹40,000 round trip from ${params.sourceCountry}`,
      accommodationEstimate: '₹2,500 – ₹4,000 per night',
      hacks: [
        'Book flights 6–8 weeks in advance for best prices',
        'Use local SIM card for cheap data (available at airport)',
        'Eat at lunch — same quality, 30% cheaper than dinner',
        'Public transport is much cheaper than taxis for city travel',
      ],
    },
    logistics: {
      gettingThere: `Direct flights available from major Indian cities. IndiGo and Air India typically offer competitive fares.`,
      localTransport: 'Metro, buses and ride-sharing apps available. Download the local transit app.',
      simCard: 'Local SIM available at airport — approximately ₹500 for 15-day unlimited data.',
      currency: 'Check XE.com for live rates. ATMs widely available. Notify your bank before travel.',
      mustHaveApps: [
        { name: 'Google Maps (Offline)', purpose: 'Navigation without internet' },
        { name: 'Google Translate', purpose: 'Real-time language translation' },
        { name: 'Uber / Local Ride App', purpose: 'Safe, priced taxis' },
        { name: 'XE Currency', purpose: 'Live exchange rates' },
      ],
    },
    landmarks: [
      { name: 'City Cathedral / Main Temple', type: 'Temple', entryFee: 'Free', bestTime: 'Morning', tip: 'Dress modestly and arrive before 9am' },
      { name: 'National Museum', type: 'Museum', entryFee: '₹300', bestTime: 'Morning', tip: 'Audio guides available in English' },
      { name: 'Central Market', type: 'Market', entryFee: 'Free', bestTime: 'Evening', tip: 'Bargain for 30–40% off listed prices' },
      { name: 'City Viewpoint', type: 'Park', entryFee: 'Free', bestTime: 'Sunset', tip: 'Arrive 30 min before sunset for best photos' },
      { name: 'Historic Old Quarter', type: 'Museum', entryFee: 'Free', bestTime: 'Anytime', tip: 'Explore on foot — lanes are too narrow for vehicles' },
    ],
  };
}
