import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { task, params } = await req.json()
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch the Claude API key from the database
    const { data: configData, error: configError } = await supabaseClient
      .from('ai_config')
      .select('value')
      .eq('key', 'CLAUDE_API_KEY')
      .single()

    if (configError || !configData) {
      throw new Error('Claude API Key not found in database')
    }

    const apiKey = configData.value.trim()
    let prompt = ''

    if (task === 'price-advice') {
      prompt = `
        You are an expert flight price analyst. Based on the following price data for the route ${params.route}:
        - Current Price: ₹${params.currentPrice}
        - Recent Price History: ${params.history.join(', ')}
        - Avg Price this month: ₹${params.avgPrice}
        - Min Price this month: ₹${params.minPrice}
        
        Analyze the trend and provide:
        1. VERDICT: "Book NOW", "Wait", or "Monitor"
        2. CONFIDENCE: Percentage (0-100)
        3. DIRECTION: "rising", "falling", or "stable"
        4. DETAIL: A brief (15-20 words) explanation of WHY, including any seasonality or market logic.
        
        Return ONLY a JSON object:
        {
          "verdict": "...",
          "confidence": 85,
          "priceDirection": "...",
          "detail": "..."
        }
      `
    } else if (task === 'travel-tips') {
      prompt = `
        You are a local travel expert for ${params.destination}.
        Provide 4 unique, hyper-local, and practical travel tips for someone visiting on ${params.dates}.
        Include at least one tip about weather/packing and one about a hidden gem.
        
        Return ONLY a JSON array of strings:
        ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]
      `
    } else if (task === 'deal-summary') {
      prompt = `
        You are a high-energy travel deal scout. A massive mistake fare was found:
        - Route: ${params.from} to ${params.to}
        - Price: ₹${params.price}
        - Drop: ${params.drop}% lower than usual
        
        Write a short (max 20 words), extremely persuasive, and exciting summary for a WhatsApp alert. Use emojis.
        
        Return ONLY a JSON object:
        { "summary": "..." }
      `
    } else {
      throw new Error('Unknown AI task')
    }

    let response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
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
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      })
      data = await response.json()
    }

    if (!response.ok) throw new Error(data.error?.message || 'Claude API Error')

    const content = data.content[0].text
    
    return new Response(content, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('AI Analyst Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
