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
    const apiKey = Deno.env.get('CLAUDE_API_KEY')

    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY is not set in Supabase Secrets')
    }

    const prompt = `
      You are a professional travel consultant and local expert. 
      Create a travel plan for:
      - Destination: ${params.destination}
      - Nationality: ${params.nationality}
      - Source Country: ${params.sourceCountry}
      - Dates: ${params.dates}
      - Budget: ${params.budget}
      - Preferences: ${params.preferences}

      Response format (JSON ONLY):
      {
        "visaInfo": "...",
        "itinerary": [{"title": "...", "content": "..."}],
        "hacks": ["..."],
        "apps": ["..."],
        "foodInfo": "...",
        "destinationInfo": "..."
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
    
    if (data.error) {
      throw new Error(data.error.message || 'Claude API Error')
    }

    const content = data.content[0].text
    
    return new Response(content, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
