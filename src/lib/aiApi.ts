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
  // We use a Supabase Edge Function to proxy the request to Claude.
  // This avoids CORS issues and keeps the API key secure on the server.
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/itinerary-generator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ params })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to connect to AI engine');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('AI Generation Error:', error);
    // Fallback to mock data for demo stability if the function is not configured
    if (error.message?.includes('not found') || error.message?.includes('404')) {
      return getMockItinerary(params);
    }
    throw error;
  }
}

function getMockItinerary(params: any) {
  return {
    visaInfo: `For ${params.nationality} citizens, ${params.destination} usually offers an E-Visa or Visa on Arrival. Hack: Use the official government portal instead of third-party agencies to save $50.`,
    itinerary: [
      { title: "Arrival & City Immersion", content: "Check into your hotel, head to the central square for a local coffee, and take a sunset walk." },
      { title: "Hidden Gems & Local Culture", content: "Visit the local market early morning. Explore the historic district and dine at a family-run bistro." },
      { title: "Adventure & Views", content: "Hike or take a cable car to the highest viewpoint. Spend the afternoon in a hidden garden." }
    ],
    hacks: [
      "Buy a local SIM card at the airport for 70% cheaper data.",
      "Use the 'CityPass' for free public transport and museum entries.",
      "Eat your main meal at lunch to take advantage of 'Set Menu' prices."
    ],
    apps: ["Google Maps (Offline)", "Citymapper", "Google Translate", "Revolut"],
    foodInfo: "Try the local specialty street food like [Local Dish]. For authentic versions, visit [Famous Restaurant].",
    weatherInfo: "Expect pleasant weather with temperatures between 15°C and 22°C. Pack light layers and comfortable walking shoes.",
    destinationInfo: "The locals are friendly but appreciate when you learn a few basic phrases in their language."
  };
}
