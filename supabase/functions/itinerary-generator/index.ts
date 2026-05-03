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

    const apiKey = configData.value

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

      Response format (JSON ONLY):
      {
        "visaInfo": "Visa requirements for ${params.nationality} citizens traveling from ${params.sourceCountry} to ${params.destination}. Include any 'hacks' like e-visa vs on-arrival.",
        "itinerary": [
          {"title": "Day 1: [Specific Area Name]", "content": "Detailed plan including specific landmarks and transit tips..."},
          ...
        ],
        "hacks": ["Specific hack 1", "Specific hack 2", ...],
        "apps": ["Local transit app name", "Local food delivery app", ...],
        "foodInfo": "Detailed guide on dishes like [Dish Name] and restaurants like [Restaurant Name]...",
        "weatherInfo": "Forecast for ${params.dates}: [Temperature range], [Conditions]. Advice: [What to pack]...",
        "destinationInfo": "Brief cultural context and the 'vibe' of the place."
      }
    `

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Claude API returned an error')
    }

    const content = data.content[0].text
    
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
