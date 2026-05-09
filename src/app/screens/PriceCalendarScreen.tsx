import { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, ArrowRight, Plane, TrendingDown, TrendingUp, Minus, Zap, RefreshCw, Brain } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { fetchRouteCalendar, getSparklineData, getAIPriceAdvice, RouteCalendar, PriceTrend } from '../../lib/priceHistoryApi';
import { useStore } from '../../store/useStore';

const POPULAR_ROUTES = [
  { from: 'DEL', to: 'BKK', label: 'Delhi → Bangkok', flag: '🇹🇭' },
  { from: 'DEL', to: 'DXB', label: 'Delhi → Dubai', flag: '🇦🇪' },
  { from: 'BOM', to: 'SIN', label: 'Mumbai → Singapore', flag: '🇸🇬' },
  { from: 'DEL', to: 'LHR', label: 'Delhi → London', flag: '🇬🇧' },
  { from: 'DEL', to: 'KUL', label: 'Delhi → Kuala Lumpur', flag: '🇲🇾' },
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80, h = 30;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / range) * h} r="3" fill={color} />
    </svg>
  );
}

function PriceCell({ date, price, min, max, avg, isSelected, onClick, isToday }: {
  date: string; price: number | null; min: number; max: number; avg: number;
  isSelected: boolean; onClick: () => void; isToday: boolean;
}) {
  const label = new Date(date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'short' });
  const dayNum = new Date(date + 'T12:00:00').getDate();

  let bg = 'bg-white/30 text-[#001F3F]/50';
  let priceBg = '';
  if (price !== null) {
    if (price <= min * 1.05) { bg = 'bg-[#00A854]/10 text-[#00A854]'; priceBg = 'text-[#00A854] font-black'; }
    else if (price <= avg * 0.9) { bg = 'bg-[#4CAF50]/8 text-[#2E7D32]'; priceBg = 'text-[#2E7D32] font-black'; }
    else if (price >= max * 0.95) { bg = 'bg-[#FF6B6B]/10 text-[#E74C3C]'; priceBg = 'text-[#E74C3C] font-bold'; }
    else { bg = 'bg-white/60 text-[#001F3F]'; priceBg = 'text-[#001F3F]/70 font-bold'; }
  }

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-xl transition-all text-center border-2 ${bg} ${
        isSelected ? 'border-[#0047AB] shadow-lg scale-105' : 'border-transparent'
      } ${isToday ? 'ring-2 ring-[#F39C12]/40' : ''}`}
    >
      <div className="text-[9px] font-bold opacity-60">{label}</div>
      <div className="text-sm font-black">{dayNum}</div>
      {price !== null ? (
        <div className={`text-[9px] leading-tight mt-0.5 ${priceBg}`}>
          ₹{price >= 1000 ? `${Math.round(price / 1000)}k` : price}
        </div>
      ) : (
        <div className="text-[9px] opacity-30">—</div>
      )}
      {price !== null && price <= min * 1.05 && (
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#00A854] rounded-full flex items-center justify-center">
          <span className="text-white" style={{ fontSize: 7 }}>★</span>
        </div>
      )}
    </button>
  );
}

export function PriceCalendarScreen() {
  const user = useStore(state => state.user);
  const homeAirport = user?.homeAirport?.match(/\((\w+)\)/)?.[1] || user?.homeAirport || 'DEL';

  const [selectedRoute, setSelectedRoute] = useState(
    POPULAR_ROUTES.find(r => r.from === homeAirport) || POPULAR_ROUTES[0]
  );
  const [customFrom, setCustomFrom] = useState(homeAirport);
  const [customTo, setCustomTo] = useState('BKK');
  const [calendar, setCalendar] = useState<RouteCalendar | null>(null);
  const [trend, setTrend] = useState<PriceTrend | null>(null);
  const [sparkline, setSparkline] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [monthOffset, setMonthOffset] = useState(0);
  const [mode, setMode] = useState<'preset' | 'custom'>('preset');

  const fetchCalendar = async (from: string, to: string) => {
    setIsLoading(true);
    setCalendar(null);
    setTrend(null);
    setSelectedDate(null);
    try {
      const cal = await fetchRouteCalendar(from, to, 30);
      setCalendar(cal);

      if (cal.prices.length > 0) {
        const spark = await getSparklineData(from, to, cal.avgPrice);
        setSparkline(spark);
        
        // Use AI for better advice
        const t = await getAIPriceAdvice(
          `${from} → ${to}`,
          cal.cheapestPrice,
          spark,
          cal.minPrice,
          cal.avgPrice
        );
        setTrend(t);
      }
    } catch (err) {
      console.error('[Calendar] fetch failed:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCalendar(selectedRoute.from, selectedRoute.to);
  }, [selectedRoute]);

  const handleSelectDate = (point: any) => {
    setSelectedDate(point.date);
    setSelectedPoint(point);
  };

  // Filter prices by current month view
  const viewMonth = new Date();
  viewMonth.setMonth(viewMonth.getMonth() + monthOffset);
  const viewYear = viewMonth.getFullYear();
  const viewMonthNum = viewMonth.getMonth();

  const monthPrices = calendar?.prices.filter(p => {
    const d = new Date(p.date + 'T12:00:00');
    return d.getFullYear() === viewYear && d.getMonth() === viewMonthNum;
  }) ?? [];

  // Build full month grid (pad start with empty days)
  const firstDay = new Date(viewYear, viewMonthNum, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonthNum + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  const priceMap = new Map(monthPrices.map(p => [p.date, p]));

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={16} className="text-[#0047AB]" />
          <span className="text-xs font-bold text-[#0047AB] uppercase tracking-widest">Sky Hunt</span>
        </div>
        <h1 className="text-3xl font-black text-[#001F3F]">Best Price<br />Calendar</h1>
        <p className="text-sm text-[#001F3F]/50 font-medium mt-1">Find the cheapest day to fly — 30-day view</p>
      </div>

      <div className="px-5 space-y-4">
        {/* Route selector tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['preset', 'custom'].map(m => (
            <button key={m} onClick={() => setMode(m as any)}
              className={`px-4 py-2 rounded-xl text-sm font-black whitespace-nowrap transition-all ${mode === m ? 'bg-[#0047AB] text-white' : 'bg-white/60 text-[#001F3F]/50'}`}>
              {m === 'preset' ? '🔥 Popular Routes' : '✏️ Custom Route'}
            </button>
          ))}
        </div>

        {mode === 'preset' ? (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {POPULAR_ROUTES.map(route => (
              <button key={route.to}
                onClick={() => setSelectedRoute(route)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all border-2 ${
                  selectedRoute.to === route.to ? 'border-[#0047AB] bg-[#0047AB]/5 text-[#0047AB]' : 'border-transparent bg-white/60 text-[#001F3F]/60'
                }`}>
                <span>{route.flag}</span>{route.label}
              </button>
            ))}
          </div>
        ) : (
          <LiquidGlassCard size="small">
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <label className="text-[9px] font-black text-[#001F3F]/40 uppercase tracking-widest">From (IATA)</label>
                <input value={customFrom} onChange={e => setCustomFrom(e.target.value.toUpperCase())}
                  className="w-full font-black text-[#001F3F] bg-transparent border-none focus:outline-none text-lg"
                  maxLength={3} placeholder="DEL" />
              </div>
              <Plane size={18} className="text-[#0047AB] flex-shrink-0" />
              <div className="flex-1 text-right">
                <label className="text-[9px] font-black text-[#001F3F]/40 uppercase tracking-widest">To (IATA)</label>
                <input value={customTo} onChange={e => setCustomTo(e.target.value.toUpperCase())}
                  className="w-full font-black text-[#001F3F] bg-transparent border-none focus:outline-none text-lg text-right"
                  maxLength={3} placeholder="BKK" />
              </div>
              <PremiumButton size="small" onClick={() => fetchCalendar(customFrom, customTo)} disabled={customFrom.length !== 3 || customTo.length !== 3}>
                <RefreshCw size={14} />
              </PremiumButton>
            </div>
          </LiquidGlassCard>
        )}

        {/* AI Trend Card */}
        {trend && !isLoading && (
          <LiquidGlassCard className={`bg-gradient-to-r ${
            trend.verdict === 'Book NOW' ? 'from-[#E74C3C]/8 border-[#E74C3C]/25' :
            trend.verdict === 'Wait' ? 'from-[#00A854]/8 border-[#00A854]/25' :
            'from-[#F39C12]/8 border-[#F39C12]/25'
          }`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: trend.color + '20' }}>
                <Brain size={20} style={{ color: trend.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-[#001F3F]/40 uppercase tracking-widest">{trend.route} · AI Advice</span>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl font-black" style={{ color: trend.color }}>{trend.verdict}</span>
                  <span className="text-xs font-black text-[#001F3F]/30">{trend.confidence}% confidence</span>
                  {trend.priceDirection === 'rising'
                    ? <TrendingUp size={14} className="text-[#E74C3C]" />
                    : trend.priceDirection === 'falling'
                    ? <TrendingDown size={14} className="text-[#00A854]" />
                    : <Minus size={14} className="text-[#F39C12]" />}
                </div>
                <p className="text-xs text-[#001F3F]/60 font-medium leading-relaxed">{trend.detail}</p>
              </div>
              <div className="flex-shrink-0">
                <Sparkline data={sparkline} color={trend.color} />
                <div className="text-[9px] text-center font-bold mt-1" style={{ color: trend.color }}>
                  {trend.pctChange > 0 ? '+' : ''}{trend.pctChange}% (7d)
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        )}

        {/* Price Legend */}
        {calendar && !isLoading && calendar.prices.length > 0 && (
          <div className="flex items-center gap-3 px-1">
            {[
              { color: 'bg-[#00A854]/20', label: 'Cheapest' },
              { color: 'bg-white/60', label: 'Average' },
              { color: 'bg-[#FF6B6B]/15', label: 'Expensive' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${l.color}`} />
                <span className="text-[10px] font-bold text-[#001F3F]/50">{l.label}</span>
              </div>
            ))}
            <div className="ml-auto text-[10px] font-black text-[#001F3F]/40">
              Avg: ₹{calendar.avgPrice.toLocaleString('en-IN')}
            </div>
          </div>
        )}

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button onClick={() => setMonthOffset(o => Math.max(0, o - 1))}
            className="w-9 h-9 rounded-xl bg-white/50 flex items-center justify-center text-[#001F3F]/50 disabled:opacity-30"
            disabled={monthOffset === 0}>
            <ArrowLeft size={18} />
          </button>
          <span className="font-black text-[#001F3F]">
            {viewMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => setMonthOffset(o => Math.min(2, o + 1))}
            className="w-9 h-9 rounded-xl bg-white/50 flex items-center justify-center text-[#001F3F]/50 disabled:opacity-30"
            disabled={monthOffset === 2}>
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-[#0047AB]/10 border-t-[#0047AB] animate-spin" />
            <p className="text-sm font-bold text-[#001F3F]/50 animate-pulse">Scanning 30 days of prices...</p>
            <p className="text-xs text-[#001F3F]/30 font-medium">This takes ~20 seconds for live data</p>
          </div>
        ) : calendar && calendar.prices.length > 0 ? (
          <>
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[9px] font-black text-[#001F3F]/30 uppercase">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for month start padding */}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`pad-${i}`} />)}
              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, dayIdx) => {
                const dayNum = dayIdx + 1;
                const dateStr = `${viewYear}-${String(viewMonthNum + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const point = priceMap.get(dateStr);
                return (
                  <PriceCell
                    key={dateStr}
                    date={dateStr}
                    price={point?.price ?? null}
                    min={calendar.minPrice}
                    max={calendar.maxPrice}
                    avg={calendar.avgPrice}
                    isSelected={selectedDate === dateStr}
                    isToday={dateStr === today}
                    onClick={() => point && handleSelectDate(point)}
                  />
                );
              })}
            </div>

            {/* Selected date detail card */}
            {selectedDate && selectedPoint && (
              <LiquidGlassCard className="border-[#0047AB]/25 animate-slide-up">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="text-xs font-black text-[#001F3F]/40 uppercase tracking-widest mb-1">Selected Date</div>
                    <div className="text-lg font-black text-[#001F3F]">
                      {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    <div className="text-sm text-[#001F3F]/50 font-medium mt-0.5">
                      {selectedPoint.airline} · {selectedPoint.stops === 0 ? 'Direct ✈️' : `${selectedPoint.stops} stop`}
                    </div>
                    {selectedPoint.price <= calendar.minPrice * 1.05 && (
                      <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-lg bg-[#00A854]/10 text-[#00A854] text-xs font-black">
                        ★ Cheapest this month
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-[#00A854]">₹{selectedPoint.price.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-[#001F3F]/40 font-medium">per person</div>
                    <PremiumButton
                      variant="success"
                      size="small"
                      className="mt-2"
                      onClick={() => selectedPoint.bookingUrl && window.open(selectedPoint.bookingUrl, '_blank')}
                    >
                      <Zap size={14} /> Book Now
                    </PremiumButton>
                  </div>
                </div>
              </LiquidGlassCard>
            )}

            {/* Route summary stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Cheapest', value: `₹${calendar.cheapestPrice.toLocaleString('en-IN')}`, color: '#00A854', sub: calendar.cheapestDate },
                { label: 'Average', value: `₹${calendar.avgPrice.toLocaleString('en-IN')}`, color: '#0047AB', sub: 'this month' },
                { label: 'Priciest', value: `₹${calendar.maxPrice.toLocaleString('en-IN')}`, color: '#FF6B6B', sub: 'peak date' },
              ].map(s => (
                <LiquidGlassCard key={s.label} size="small" className="text-center py-3">
                  <div className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: s.color }}>{s.label}</div>
                  <div className="font-black text-[#001F3F] text-sm">{s.value}</div>
                  <div className="text-[9px] text-[#001F3F]/40 font-medium mt-0.5">{s.sub}</div>
                </LiquidGlassCard>
              ))}
            </div>
          </>
        ) : !isLoading && (
          <div className="py-16 text-center">
            <Calendar size={40} className="mx-auto text-[#001F3F]/20 mb-3" />
            <p className="text-sm font-bold text-[#001F3F]/50">No price data for this route.</p>
            <p className="text-xs text-[#001F3F]/30 mt-1">Try a different route or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
