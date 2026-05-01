import { useState, useEffect } from 'react';
import { Flame, TrendingDown, Clock, Zap, Sparkles, RefreshCw, Brain } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';

const flashSales = [
  { from: 'Delhi', to: 'Bangkok', flag: '🇹🇭', price: 6200, original: 12500, discount: 50, departure: 'Tomorrow 14:30', airlines: ['Thai Airways', 'Air Asia'] },
  { from: 'Mumbai', to: 'Phuket', flag: '🏝️', price: 5800, original: 11600, discount: 50, departure: 'Apr 25 10:00', airlines: ['IndiGo', 'Air India'] },
];

const priceDrops = [
  { route: 'Delhi → London', flag: '🇬🇧', drop: 22, price: 43500 },
  { route: 'Bangalore → Singapore', flag: '🇸🇬', drop: 18, price: 20500 },
  { route: 'Mumbai → Dubai', flag: '🇦🇪', drop: 15, price: 8200 },
];

const aiRecs = [
  { label: 'US Routes', timing: 'Book NOW', color: '#00A854', bg: 'bg-[#00A854]/10 border-[#00A854]/20', detail: 'Book by Apr 24 · Save ~8% · 92% confidence' },
  { label: 'EU Routes', timing: 'Book Soon', color: '#F39C12', bg: 'bg-[#F39C12]/10 border-[#F39C12]/20', detail: 'Moderate savings in next 14 days' },
  { label: 'Asian Routes', timing: 'Wait', color: '#E74C3C', bg: 'bg-[#E74C3C]/10 border-[#E74C3C]/20', detail: 'Prices expected to drop further in May' },
];

export function DealsScreen() {
  const [countdown, setCountdown] = useState({ h: 6, m: 45, s: 0 });

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown((p) => {
        if (p.s > 0) return { ...p, s: p.s - 1 };
        if (p.m > 0) return { h: p.h, m: p.m - 1, s: 59 };
        if (p.h > 0) return { h: p.h - 1, m: 59, s: 59 };
        return p;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="min-h-screen pb-28">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame size={14} className="text-[#FF6B6B]" />
              <span className="text-xs font-bold text-[#FF6B6B] uppercase tracking-widest">Live Now</span>
            </div>
            <h1 className="text-3xl font-black text-[#001F3F]">Deals & Offers</h1>
            <p className="text-sm text-[#001F3F]/50 font-medium mt-1">Flash sales · Price drops · AI picks</p>
          </div>
          <button className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#F39C12] flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,107,0.35)]">
            <RefreshCw size={20} className="text-white" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-5 pb-5 no-scrollbar">
        {['All Deals', 'Flash Sales', 'Price Drops', 'Coming Soon'].map((tab, i) => (
          <button key={tab} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold ${i === 0 ? 'bg-gradient-to-r from-[#FF6B6B] to-[#F39C12] text-white shadow-md' : 'bg-white/30 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F]/60'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-6">
        {/* Flash Sales */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Flame size={18} className="text-[#FF6B6B]" />
            <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest">Flash Sales</h2>
          </div>
          <div className="space-y-3">
            {flashSales.map((deal, i) => (
              <LiquidGlassCard key={i} className="border-[#FF6B6B]/30">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-4xl">{deal.flag}</span>
                  <div className="flex-1">
                    <div className="font-black text-[#001F3F] text-lg">{deal.from} → {deal.to}</div>
                    <div className="text-xs text-[#001F3F]/50 font-medium mt-0.5">{deal.departure}</div>
                    <div className="text-xs text-[#001F3F]/40 mt-0.5">{deal.airlines.join(' · ')}</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#f15959] text-white text-sm font-black flex-shrink-0">
                    {deal.discount}% OFF
                  </div>
                </div>

                <div className="flex items-end gap-3 mb-3">
                  <div className="text-3xl font-black bg-gradient-to-r from-[#00A854] to-[#008f47] bg-clip-text text-transparent">
                    ₹{deal.price.toLocaleString('en-IN')}
                  </div>
                  <div className="text-base text-[#001F3F]/30 line-through pb-0.5">₹{deal.original.toLocaleString('en-IN')}</div>
                  <div className="ml-auto text-xs font-black text-[#00A854] bg-[#00A854]/10 px-2 py-1 rounded-lg">
                    Save ₹{(deal.original - deal.price).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FF6B6B]/8 border border-[#FF6B6B]/15 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B6B] to-[#f15959] flex items-center justify-center flex-shrink-0">
                    <Clock size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-[10px] text-[#001F3F]/50 font-bold uppercase">Expires in</div>
                    <div className="text-xl font-black text-[#FF6B6B] tabular-nums">{pad(countdown.h)}h {pad(countdown.m)}m {pad(countdown.s)}s</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <PremiumButton variant="glass" className="flex-1">Details</PremiumButton>
                  <PremiumButton variant="success" className="flex-1">
                    <Zap size={16} />Book Now
                  </PremiumButton>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </div>

        {/* Price Drops */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={18} className="text-[#00A854]" />
            <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest">Top Price Drops &gt;15%</h2>
          </div>
          <div className="space-y-2.5">
            {priceDrops.map((drop, i) => (
              <LiquidGlassCard key={i} hoverable size="small">
                <div className="flex items-center gap-3">
                  <span className="text-3xl flex-shrink-0">{drop.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-[#001F3F] text-sm">{drop.route}</div>
                    <div className="text-lg font-black text-[#0047AB] mt-0.5">₹{drop.price.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-black text-[#00A854]">↓{drop.drop}%</div>
                    <PremiumButton variant="success" size="small" className="mt-1">View</PremiumButton>
                  </div>
                </div>
              </LiquidGlassCard>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <LiquidGlassCard pulseIndicator>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <div className="font-black text-[#001F3F]">AI Booking Recommendations</div>
              <div className="text-xs text-[#001F3F]/50 font-medium">Updated 5 min ago</div>
            </div>
          </div>
          <div className="space-y-2.5">
            {aiRecs.map((rec) => (
              <div key={rec.label} className={`flex items-start gap-3 p-3 rounded-xl border ${rec.bg}`}>
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: rec.color }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[#001F3F]">{rec.label}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: rec.color }}>{rec.timing}</span>
                  </div>
                  <div className="text-xs text-[#001F3F]/50 font-medium mt-0.5">{rec.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </LiquidGlassCard>

        <PremiumButton variant="glass" className="w-full">
          <Sparkles size={16} />
          Refresh All Deals
        </PremiumButton>
      </div>
    </div>
  );
}
