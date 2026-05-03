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
