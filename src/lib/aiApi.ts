export async function generateItinerary(params: {
  destination: string;
  nationality: string;
  sourceCountry: string;
  dates: string;
  duration: string;
  preferences: string;
  budget: string;
}) {
  const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

  if (!CLAUDE_API_KEY || CLAUDE_API_KEY === 'YOUR_CLAUDE_API_KEY') {
    // Return mock data if key is missing for demo safety
    return getMockItinerary(params);
  }

  const prompt = `
    You are a professional world-travel consultant and local expert. 
    Create a highly detailed, premium travel master plan for a traveler with the following details:
    - Destination: ${params.destination}
    - Nationality: ${params.nationality}
    - Source Country: ${params.sourceCountry}
    - Dates: ${params.dates}
    - Budget: ${params.budget}
    - Special Preferences: ${params.preferences}

    Provide the response in the following JSON format ONLY:
    {
      "visaInfo": "Detailed visa requirements for ${params.nationality} traveling to ${params.destination}. Include if it's e-visa, on-arrival, or sticker. Mention any hacks to speed up the process.",
      "itinerary": [
        {"title": "Morning/Afternoon/Evening focus", "content": "Detailed activities for Day 1"},
        {"title": "...", "content": "..."}
      ],
      "hacks": ["Money saving hack 1", "Travel hack 2", "Secret local spot 3"],
      "apps": ["App Name 1", "App Name 2"],
      "foodInfo": "Top 3 local dishes to try and where to find the best authentic versions.",
      "destinationInfo": "One paragraph of essential cultural context or safety tips."
    }

    Keep the tone professional, encouraging, and focused on "mastering" the destination.
  `;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const content = data.content[0].text;
    return JSON.parse(content);
  } catch (error) {
    console.error('Claude API Error:', error);
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
    foodInfo: "Try the local specialty street food. For authentic versions, look for places with long queues of locals.",
    destinationInfo: "The locals are friendly but appreciate when you learn a few basic phrases in their language."
  };
}
