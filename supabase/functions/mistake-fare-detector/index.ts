import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to compute z-score
function computeZScore(price: number, history: number[]) {
  if (history.length < 3) return 0; // Not enough data
  const mean = history.reduce((a, b) => a + b, 0) / history.length;
  const variance = history.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / history.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev === 0) return 0;
  return (price - mean) / stdDev;
}

Deno.serve(async (req) => {
  try {
    // 1. Fetch the latest prices for active routes
    const { data: latestPrices, error: fetchError } = await supabase
      .from('calendar_prices')
      .select('from_city, to_city, price, departure_date')
      .order('price', { ascending: true })
      .limit(20);

    if (fetchError) throw fetchError;

    const detectedAnomalies = [];

    // 2. For each route, fetch history and compute z-score
    for (const deal of latestPrices) {
      const { data: historyData } = await supabase
        .from('route_price_history')
        .select('cheapest_price')
        .eq('from_city', deal.from_city)
        .eq('to_city', deal.to_city)
        .order('date', { ascending: false })
        .limit(14);

      if (historyData && historyData.length > 3) {
        const historyPrices = historyData.map(h => h.cheapest_price);
        const zScore = computeZScore(deal.price, historyPrices);
        
        // Z-Score <= -2.5 is a highly significant drop (Mistake Fare territory)
        // Usually, prices falling below 3 standard deviations means an error.
        if (zScore <= -2.5) {
          detectedAnomalies.push({
            route: `${deal.from_city} -> ${deal.to_city}`,
            price: deal.price,
            date: deal.departure_date,
            zScore: zScore.toFixed(2),
            meanPrice: Math.round(historyPrices.reduce((a, b) => a + b, 0) / historyPrices.length),
          });
        }
      }
    }

    // 3. Notify users tracking these routes via WhatsApp (Integration)
    for (const anomaly of detectedAnomalies) {
      // Generate a catchy AI summary for the deal
      let aiDealSummary = `🚨 MISTAKE FARE: ${anomaly.route} for ₹${anomaly.price}!`;
      
      try {
        const aiResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-analyst`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'apikey': Deno.env.get('SUPABASE_ANON_KEY')!,
          },
          body: JSON.stringify({
            task: 'deal-summary',
            params: { from: anomaly.route.split('->')[0].trim(), to: anomaly.route.split('->')[1].trim(), price: anomaly.price, drop: 50 } // Assume 50% for now
          })
        });
        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          aiDealSummary = aiData.summary;
        }
      } catch (e) {
        console.error('AI Summary failed, using fallback:', e);
      }

      // Fetch users tracking this route or with 'pro' tier for general alerts
      const { data: usersToNotify } = await supabase
        .from('profiles')
        .select('phone_number, full_name')
        .eq('account_tier', 'pro')
        .not('phone_number', 'is', null);

      if (usersToNotify && usersToNotify.length > 0) {
        for (const user of usersToNotify) {
          // Meta Graph API or Twilio WhatsApp API call
          const whatsappRes = await fetch(`https://graph.facebook.com/v18.0/${Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('WHATSAPP_API_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: user.phone_number,
              type: "template",
              template: {
                name: "mistake_fare_alert",
                language: { code: "en_US" },
                components: [
                  {
                    type: "body",
                    parameters: [
                      { type: "text", text: user.full_name },
                      { type: "text", text: aiDealSummary },
                      { type: "text", text: `₹${anomaly.price.toLocaleString('en-IN')}` },
                      { type: "text", text: anomaly.date }
                    ]
                  }
                ]
              }
            })
          });
          
          if (!whatsappRes.ok) {
            console.error(`Failed to send WhatsApp to ${user.phone_number}:`, await whatsappRes.text());
          }
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      scanned: latestPrices.length,
      anomaliesFound: detectedAnomalies.length,
      anomalies: detectedAnomalies
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
