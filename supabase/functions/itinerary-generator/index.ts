import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { params } = await req.json()
    
    // Initialize Supabase client to fetch the key from the database
    // We use the service role key to bypass RLS and fetch the sensitive config
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: configData, error: configError } = await supabaseClient
      .from('ai_config')
      .select('value')
      .eq('key', 'CLAUDE_API_KEY')
      .single()

    if (configError || !configData) {
      console.error('Database Fetch Error:', configError)
      throw new Error('Claude API Key not found in database')
    }

    const apiKey = configData.value.trim()

    const prompt = `
      You are a world-class travel architect and cultural expert. 
      Create a hyper-detailed, destination-specific travel master plan for:
      - Destination: ${params.destination}
      - Nationality: ${params.nationality}
      - Source Country: ${params.sourceCountry}
      - Dates: ${params.dates}
      - Budget: ${params.budget}
      - Preferences: ${params.preferences}
      ${params.extraContext ? `\n      - ADDITIONAL LIVE DATA: ${params.extraContext}` : ''}

      CRITICAL REQUIREMENTS:
      1. DO NOT give generic advice. Mention specific street names, local restaurant names, and precise landmarks.
      2. WEATHER: Provide a localized weather forecast for the specific dates mentioned (${params.dates}). Suggest specific clothing based on this.
      3. FOOD: Suggest at least 3 specific "must-try" local dishes and 2-3 specific famous or hidden-gem restaurants/cafes by name.
      4. ITINERARY: Create a logical flow. If multiple cities are mentioned in the destination, include transit advice between them.
      5. HACKS: Provide destination-specific money-saving hacks (e.g., specific transit passes, "free entry" days for museums).
      6. CONCISENESS: Be extremely detailed but avoid repetitive filler text. Keep the entire response under 6000 characters.

      Response format MUST BE EXACTLY THIS JSON (Do not include markdown blocks or any other text):
      {
        "destination": "${params.destination}",
        "tripSummary": "A brief engaging summary of the trip...",
        "visa": {
          "status": "e.g., e-Visa, Visa on Arrival",
          "cost": "e.g., USD 25",
          "processingTime": "e.g., 3-5 days",
          "validity": "e.g., 30 days",
          "requirements": ["req1", "req2"],
          "proTip": "A useful visa tip"
        },
        "weather": {
          "summary": "Short weather summary",
          "temperature": "e.g., 22°C – 30°C",
          "conditions": "e.g., Mostly sunny",
          "packingList": ["item1", "item2"],
          "avoidItems": ["item1", "item2"]
        },
        "itinerary": [
          {
            "day": 1,
            "theme": "Day theme",
            "area": "Specific Area Name",
            "morning": "Detailed morning plan...",
            "afternoon": "Detailed afternoon plan...",
            "evening": "Detailed evening plan...",
            "transit": "Transit tips for the day",
            "insiderTip": "A cool hack for the day"
          }
        ],
        "food": {
          "mustTryDishes": [
            {"name": "Dish 1", "description": "Desc...", "whereToTry": "Place name"}
          ],
          "topRestaurants": [
            {"name": "Rest 1", "cuisine": "Local", "priceRange": "₹₹", "knownFor": "Good food", "area": "Downtown"}
          ],
          "streetFoodSpots": ["Spot 1", "Spot 2"]
        },
        "budget": {
          "dailyEstimate": "e.g., ₹3,000 – ₹5,000",
          "flightEstimate": "e.g., ₹20,000",
          "accommodationEstimate": "e.g., ₹2,500 per night",
          "hacks": ["hack1", "hack2"]
        },
        "logistics": {
          "gettingThere": "Info...",
          "localTransport": "Info...",
          "simCard": "Info...",
          "currency": "Info...",
          "mustHaveApps": [
            {"name": "App1", "purpose": "Navigation"}
          ]
        },
        "landmarks": [
          {"name": "Place 1", "type": "Museum", "entryFee": "Free", "bestTime": "Morning", "tip": "tip...", "coordinates": {"lat": 0.0, "lng": 0.0}}
        ]
      }
    `

    let response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    let data = await response.json()
    
    // Fallback to Haiku 4.5 if Sonnet 4.6 is not found
    if (!response.ok && data.error?.type === 'not_found_error') {
      console.warn('Claude Sonnet 4.6 not found, falling back to Claude Haiku 4.5...')
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 8000,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      data = await response.json()
    }

    if (!response.ok) {
      throw new Error(data.error?.message || 'Claude API returned an error')
    }

    let content = data.content[0].text;
    console.log('[itinerary-generator] Claude Response Length:', content.length);
    console.log('[itinerary-generator] Response Start:', content.substring(0, 100));
    console.log('[itinerary-generator] Response End:', content.substring(content.length - 100));
    
    // Robust JSON extraction: strip markdown backticks and potential prefix/suffix text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      content = jsonMatch[0];
    }
    
    return new Response(content, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Function Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
