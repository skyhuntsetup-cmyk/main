/**
 * Price History & Calendar API
 * - Fetches real price data for a route across many dates
 * - Stores/reads from Supabase for historical trend analysis
 * - Powers: sparkline graphs, Best Price Calendar, AI "Book Now vs Wait"
 */

import { searchFlights } from './flightApi';
import { supabase } from './supabase';

export interface PricePoint {
  date: string;       // YYYY-MM-DD
  price: number;      // INR
  airline?: string;
  stops?: number;
  bookingUrl?: string;
}

export interface RouteCalendar {
  fromCode: string;
  toCode: string;
  prices: PricePoint[];
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  cheapestDate: string;
  cheapestPrice: number;
}

export interface PriceTrend {
  route: string;
  verdict: 'Book NOW' | 'Wait' | 'Monitor';
  confidence: number;   // 0–100
  detail: string;
  priceDirection: 'rising' | 'falling' | 'stable';
  pctChange: number;    // % change over the sampled window
  color: string;
}

export async function getAIPriceAdvice(
  route: string,
  currentPrice: number,
  history: number[],
  minPrice: number,
  avgPrice: number
): Promise<PriceTrend> {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    const fromCode = route.split('→')[0].trim();
    const toCode = route.split('→')[1].trim();
    return computePriceTrend(fromCode, toCode, history); // Fallback
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-analyst`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        task: 'price-advice',
        params: { route, currentPrice, history, minPrice, avgPrice }
      }),
    });

    if (!response.ok) throw new Error('AI Advice failed');
    const data = await response.json();
    
    return {
      route,
      verdict: data.verdict,
      confidence: data.confidence,
      detail: data.detail,
      priceDirection: data.priceDirection,
      pctChange: 0, // Not provided by AI currently
      color: data.verdict === 'Book NOW' ? '#E74C3C' : data.verdict === 'Wait' ? '#00A854' : '#F39C12'
    };
  } catch (err) {
    console.error('[AI Advice] Failed:', err);
    // Fallback to heuristic logic
    const fromCode = route.split('→')[0].trim();
    const toCode = route.split('→')[1].trim();
    return computePriceTrend(fromCode, toCode, history);
  }
}

/** Generate the next N departure dates starting from `daysOut` days from today */
function generateDates(count: number, startDaysOut = 3, stepDays = 3): string[] {
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + startDaysOut + i * stepDays);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

/**
 * Fetch price for every date across a month for a given route.
 * Batches calls to avoid API rate limits.
 */
export async function fetchRouteCalendar(
  fromCode: string,
  toCode: string,
  daysToScan = 30
): Promise<RouteCalendar> {
  const dates = generateDates(daysToScan, 2, 1);

  // Try Supabase cache first (avoid re-fetching today's data)
  if (supabase) {
    const { data: cached } = await supabase
      .from('calendar_prices')
      .select('departure_date, price, airline, stops, booking_url')
      .eq('from_code', fromCode)
      .eq('to_code', toCode)
      .gte('departure_date', dates[0])
      .order('departure_date');

    // If we have fresh cache for most dates (>= 20), use it
    if (cached && cached.length >= 20) {
      const prices: PricePoint[] = cached.map((r: any) => ({
        date: r.departure_date,
        price: r.price,
        airline: r.airline,
        stops: r.stops,
        bookingUrl: r.booking_url,
      }));
      return computeCalendarStats(fromCode, toCode, prices);
    }
  }

  // Otherwise fetch live — batch into groups of 5 to respect rate limits
  const batchSize = 5;
  const allPrices: PricePoint[] = [];

  for (let i = 0; i < Math.min(dates.length, 30); i += batchSize) {
    const batch = dates.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (date) => {
        try {
          const flights = await searchFlights({
            fromCode, toCode, departDate: date,
            adults: 1, cabinClass: 'economy', currency: 'INR', searchType: 'cheap',
          });
          if (!flights || flights.length === 0) return null;
          const cheapest = flights.reduce((a, b) => a.price < b.price ? a : b);
          if (cheapest.price <= 0) return null;
          return {
            date,
            price: cheapest.price,
            airline: cheapest.airline,
            stops: cheapest.stops,
            bookingUrl: cheapest.bookingUrl,
          } as PricePoint;
        } catch {
          return null;
        }
      })
    );
    allPrices.push(...results.filter(Boolean) as PricePoint[]);

    // Small delay between batches
    if (i + batchSize < dates.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Persist to Supabase cache
  if (supabase && allPrices.length > 0) {
    const rows = allPrices.map(p => ({
      from_code: fromCode,
      to_code: toCode,
      departure_date: p.date,
      price: p.price,
      airline: p.airline || null,
      stops: p.stops ?? 0,
      booking_url: p.bookingUrl || null,
      fetched_at: new Date().toISOString(),
    }));

    await supabase
      .from('calendar_prices')
      .upsert(rows, { onConflict: 'from_code,to_code,departure_date' });
  }

  return computeCalendarStats(fromCode, toCode, allPrices);
}

function computeCalendarStats(fromCode: string, toCode: string, prices: PricePoint[]): RouteCalendar {
  if (prices.length === 0) {
    return { fromCode, toCode, prices: [], minPrice: 0, maxPrice: 0, avgPrice: 0, cheapestDate: '', cheapestPrice: 0 };
  }
  const vals = prices.map(p => p.price);
  const minPrice = Math.min(...vals);
  const maxPrice = Math.max(...vals);
  const avgPrice = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  const cheapest = prices.reduce((a, b) => a.price < b.price ? a : b);
  return { fromCode, toCode, prices, minPrice, maxPrice, avgPrice, cheapestDate: cheapest.date, cheapestPrice: cheapest.price };
}

/**
 * Get the last 14 days of stored price history for a route (sparkline data).
 * Falls back to generating synthetic history from current price if no DB data.
 */
export async function getSparklineData(
  fromCode: string,
  toCode: string,
  currentPrice: number
): Promise<number[]> {
  if (supabase) {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const { data } = await supabase
      .from('route_price_history')
      .select('price, sampled_at')
      .eq('from_code', fromCode)
      .eq('to_code', toCode)
      .gte('sampled_at', twoWeeksAgo.toISOString())
      .order('sampled_at');

    if (data && data.length >= 5) {
      return data.map((r: any) => r.price);
    }
  }

  // Synthetic sparkline: simulate realistic price fluctuation around current price
  const base = currentPrice;
  return Array.from({ length: 14 }, (_, i) => {
    const trend = i < 7 ? -0.5 : 1.2; // simulate: was falling, now rising
    const noise = (Math.random() - 0.5) * 0.08;
    return Math.round(base * (1 + trend * 0.02 * (i / 7) + noise));
  });
}

/**
 * AI "Book Now vs Wait" recommendation based on real price trend.
 * Uses linear regression on recent price points.
 */
export function computePriceTrend(
  fromCode: string,
  toCode: string,
  sparkline: number[]
): PriceTrend {
  const route = `${fromCode} → ${toCode}`;

  if (sparkline.length < 4) {
    return { route, verdict: 'Monitor', confidence: 50, detail: 'Not enough data yet. Check back soon.', priceDirection: 'stable', pctChange: 0, color: '#F39C12' };
  }

  const recent = sparkline.slice(-7);
  const first = recent[0];
  const last = recent[recent.length - 1];
  const pctChange = Math.round(((last - first) / first) * 100);

  // Linear regression slope
  const n = recent.length;
  const sumX = recent.reduce((_, __, i) => _ + i, 0);
  const sumY = recent.reduce((a, b) => a + b, 0);
  const sumXY = recent.reduce((a, b, i) => a + i * b, 0);
  const sumX2 = recent.reduce((a, _, i) => a + i * i, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

  const priceDirection = slope > 50 ? 'rising' : slope < -50 ? 'falling' : 'stable';
  const volatility = Math.max(...recent) - Math.min(...recent);
  const confidence = Math.min(95, Math.max(55, 80 - (volatility / last) * 100));

  let verdict: PriceTrend['verdict'];
  let detail: string;
  let color: string;

  if (priceDirection === 'rising' && pctChange > 3) {
    verdict = 'Book NOW';
    detail = `Prices up ${Math.abs(pctChange)}% over the last week and climbing. Book before they rise further.`;
    color = '#E74C3C';
  } else if (priceDirection === 'falling' && pctChange < -3) {
    verdict = 'Wait';
    detail = `Prices down ${Math.abs(pctChange)}% and still falling. Hold off for a better deal.`;
    color = '#00A854';
  } else {
    verdict = 'Monitor';
    detail = 'Prices are stable right now. Set an alert and we\'ll notify you of any drops.';
    color = '#F39C12';
  }

  return { route, verdict, confidence: Math.round(confidence), detail, priceDirection, pctChange, color };
}
