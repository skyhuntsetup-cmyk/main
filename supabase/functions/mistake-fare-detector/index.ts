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

    // 3. (Mock) Insert notifications for users tracking these routes
    // In a real app, we'd query active alerts and insert push notifications.

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
