import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, TrendingDown, Calendar, Clock, Zap, Sparkles, RefreshCw, Brain, Lock, Crown, AlertTriangle, TrendingUp, Minus } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { ProUpgradeModal } from '../components/ProUpgradeModal';
import { CommunityFeed } from '../components/CommunityFeed';
import { fetchLiveDeals, Deal, PriceDrop } from '../../lib/dealsApi';
import { getSparklineData, computePriceTrend, PriceTrend } from '../../lib/priceHistoryApi';
import { useStore } from '../../store/useStore';

const PRO_DEALS = [
  { flag: '🇯🇵', from: 'DEL', to: 'TYO', toCity: 'Tokyo', price: 28900, original: 72000, discount: 60, departure: 'Jun 14', airlines: ['Air India', 'ANA'], stops: 1, duration: '9h 40m', tag: '🚨 MISTAKE FARE', tagColor: '#FF6B6B' },
  { flag: '🇺🇸', from: 'BOM', to: 'JFK', toCity: 'New York', price: 41200, original: 89000, discount: 54, departure: 'Aug 3', airlines: ['United', 'Air India'], stops: 1, duration: '16h 20m', tag: '✈️ Business Class', tagColor: '#8E44AD' },
  { flag: '🇬🇧', from: 'DEL', to: 'LHR', toCity: 'London', price: 34500, original: 71000, discount: 51, departure: 'Sep 5', airlines: ['British Airways'], stops: 0, duration: '9h 05m', tag: '🔥 Peak Season', tagColor: '#F39C12' },
];

const TREND_ROUTES = [
  { from: 'DEL', to: 'LHR', label: 'India → Europe' },
  { from: 'DEL', to: 'BKK', label: 'India → SE Asia' },
  { from: 'DEL', to: 'JFK', label: 'India → USA' },
];

export function DealsScreen() {
  const user = useStore(state => state.user);
  const homeAirport = user?.homeAirport?.match(/\((\w+)\)/)?.[1] || user?.homeAirport || 'DEL';
  const isPro = user?.accountTier === 'pro' || user?.accountTier === 'premium';
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState({ h: 6, m: 45, s: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [flashSales, setFlashSales] = useState<Deal[]>([]);
  const [priceDrops, setPriceDrops] = useState<PriceDrop[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'flash' | 'drops' | 'pro'>('all');
  const [trends, setTrends] = useState<PriceTrend[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(true);

  const loadDeals = async () => {
    setIsLoading(true);
    const data = await fetchLiveDeals(homeAirport);
    setFlashSales(data.flashSales);
    setPriceDrops(data.priceDrops);
    setIsLoading(false);
  };

  const loadTrends = async () => {
    setTrendsLoading(true);
    const results = await Promise.all(
      TREND_ROUTES.map(async (r) => {
        const spark = await getSparklineData(r.from, r.to, 30000);
        const trend = computePriceTrend(r.from, r.to, spark);
        return { ...trend, route: r.label };
      })
    );
    setTrends(results);
    setTrendsLoading(false);
  };

  useEffect(() => { loadDeals(); loadTrends(); }, [homeAirport]);

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(p => {
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
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame size={14} className="text-[#FF6B6B]" />
              <span className="text-xs font-bold text-[#FF6B6B] uppercase tracking-widest">Live Now · {homeAirport}</span>
            </div>
            <h1 className="text-3xl font-black text-[#001F3F]">Deals & Alerts</h1>
            <p className="text-sm text-[#001F3F]/50 font-medium mt-1">
              {isPro ? '✨ Pro Access — All deals unlocked' : `Showing free deals from ${homeAirport}`}
            </p>
          </div>
          <button onClick={loadDeals} className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#F39C12] flex items-center justify-center shadow-[0_4px_16px_rgba(255,107,107,0.35)]">
            <RefreshCw size={20} className={`text-white ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-5 no-scrollbar">
        {[
          { id: 'all', label: 'All Deals' },
          { id: 'flash', label: '⚡ Flash Sales' },
          { id: 'drops', label: '📉 Price Drops' },
          { id: 'pro', label: isPro ? '👑 Pro Deals' : '🔒 Pro Deals' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'pro' && !isPro) { setShowUpgrade(true); return; }
              setActiveTab(tab.id as any);
            }}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#FF6B6B] to-[#F39C12] text-white shadow-md'
                : 'bg-white/30 backdrop-blur-sm border-[1.5px] border-white/60 text-[#001F3F]/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <LiquidGlassCard className="animate-pulse h-48 border-[#001F3F]/10"><div /></LiquidGlassCard>
            <LiquidGlassCard className="animate-pulse h-24 border-[#001F3F]/10"><div /></LiquidGlassCard>
            <div className="text-center text-sm font-bold text-[#001F3F]/40 mt-4">Hunting for the best prices across 200+ airlines...</div>
          </div>
        ) : (
          <>
            {/* AI Book Now or Wait — always visible */}
            <LiquidGlassCard className="border-[#0047AB]/20 overflow-hidden" pulseIndicator>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center">
                    <Brain size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="font-black text-[#001F3F] text-sm">AI: Book Now or Wait?</div>
                    <div className="text-xs text-[#001F3F]/40 font-medium">Live trend analysis · {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
                <button onClick={() => navigate('/calendar')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0047AB]/8 text-[#0047AB] text-xs font-black border border-[#0047AB]/20">
                  <Calendar size={12} /> Calendar
                </button>
              </div>
              <div className="space-y-2.5">
                {trendsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 rounded-2xl bg-[#001F3F]/5 animate-pulse" />
                  ))
                ) : trends.map((t) => {
                  const Icon = t.priceDirection === 'rising' ? TrendingUp : t.priceDirection === 'falling' ? TrendingDown : Minus;
                  const bg = t.verdict === 'Book NOW' ? 'from-[#E74C3C]/8' : t.verdict === 'Wait' ? 'from-[#00A854]/8' : 'from-[#F39C12]/8';
                  return (
                    <div key={t.route} className={`p-3 rounded-2xl bg-gradient-to-r ${bg} to-transparent border border-white/40`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-black text-[#001F3F]">{t.route}</span>
                        <div className="flex items-center gap-1.5">
                          <Icon size={13} style={{ color: t.color }} />
                          <span className="text-xs font-black px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: t.color }}>
                            {t.verdict}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#001F3F]/60 font-medium">{t.detail}</p>
                      <div className="mt-2 h-1.5 rounded-full bg-[#001F3F]/8 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${t.confidence}%`, backgroundColor: t.color }} />
                      </div>
                      <div className="text-[10px] text-[#001F3F]/40 font-black mt-1 uppercase tracking-widest">{t.confidence}% Confidence · {t.pctChange > 0 ? '+' : ''}{t.pctChange}% (7d)</div>
                    </div>
                  );
                })}
              </div>
            </LiquidGlassCard>

            <div className="my-6">
              <CommunityFeed />
            </div>

            {/* Flash Sales */}
            {(activeTab === 'all' || activeTab === 'flash') && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={18} className="text-[#FF6B6B]" />
                  <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest">Flash Sales</h2>
                </div>
                <div className="space-y-3">
                  {flashSales.length > 0 ? flashSales.map((deal, i) => (
                    <LiquidGlassCard key={i} className="border-[#FF6B6B]/30">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-4xl">{deal.flag}</span>
                        <div className="flex-1">
                          <div className="font-black text-[#001F3F] text-lg">{deal.from} → {deal.toCity}</div>
                          <div className="text-xs text-[#001F3F]/50 font-medium mt-0.5">
                            Fly {deal.departure} · {deal.stops === 0 ? 'Direct ✈️' : `${deal.stops} stop${deal.stops > 1 ? 's' : ''}`} · {deal.duration}
                          </div>
                          <div className="text-xs text-[#001F3F]/40 mt-0.5">{deal.airlines.join(' · ')}</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#f15959] text-white text-sm font-black">
                            {deal.discount}% OFF
                          </div>
                          {deal.tag === 'cheapest_month' && (
                            <div className="px-2 py-0.5 rounded-lg bg-[#F39C12]/15 text-[#F39C12] text-[10px] font-black">📅 Cheapest This Month</div>
                          )}
                          {deal.tag === 'direct' && (
                            <div className="px-2 py-0.5 rounded-lg bg-[#00A854]/15 text-[#00A854] text-[10px] font-black">✈️ Direct Flight</div>
                          )}
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
                          <div className="text-xl font-black text-[#FF6B6B] tabular-nums">
                            {pad(countdown.h)}h {pad(countdown.m)}m {pad(countdown.s)}s
                          </div>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="text-[10px] text-[#001F3F]/40 font-bold uppercase">vs avg price</div>
                          <div className="text-sm font-black text-[#001F3F]/50">₹{deal.original.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <PremiumButton variant="glass" className="flex-1" onClick={() => deal.bookingUrl && window.open(deal.bookingUrl, '_blank')}>Details</PremiumButton>
                        <PremiumButton variant="success" className="flex-1" onClick={() => deal.bookingUrl && window.open(deal.bookingUrl, '_blank')}><Zap size={16} /> Book Now</PremiumButton>
                      </div>
                    </LiquidGlassCard>
                  )) : (
                    <div className="w-full p-6 rounded-2xl bg-white/30 border border-dashed border-[#001F3F]/20 text-center">
                      <span className="text-xs font-bold text-[#001F3F]/50">No flash deals found from {homeAirport} right now. Try refreshing — deals change hourly!</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price Drops */}
            {(activeTab === 'all' || activeTab === 'drops') && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown size={18} className="text-[#00A854]" />
                  <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest">Top Price Drops</h2>
                </div>
                <div className="space-y-2.5">
                  {priceDrops.length > 0 ? priceDrops.map((drop, i) => (
                    <LiquidGlassCard key={i} hoverable size="small">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl flex-shrink-0">{drop.flag}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-[#001F3F] text-sm">{drop.route}</div>
                          <div className="text-lg font-black text-[#0047AB] mt-0.5">₹{drop.price.toLocaleString('en-IN')}</div>
                          <div className="text-[10px] text-[#001F3F]/40 font-medium">{drop.stops === 0 ? 'Direct ✈️' : `${drop.stops} stop${drop.stops > 1 ? 's' : ''}`}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl font-black text-[#00A854]">↓{drop.drop}%</div>
                          <PremiumButton variant="success" size="small" className="mt-1" onClick={() => drop.bookingUrl && window.open(drop.bookingUrl, '_blank')}>View</PremiumButton>
                        </div>
                      </div>
                    </LiquidGlassCard>
                  )) : (
                    <div className="w-full p-6 rounded-2xl bg-white/30 border border-dashed border-[#001F3F]/20 text-center">
                      <span className="text-xs font-bold text-[#001F3F]/50">No recent price drops found.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pro Deals — Locked or Unlocked */}
            {(activeTab === 'all' || activeTab === 'pro') && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Crown size={18} className="text-[#F39C12]" />
                    <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest">Pro-Only Deals</h2>
                  </div>
                  {!isPro && (
                    <button onClick={() => setShowUpgrade(true)} className="text-xs font-black text-[#0047AB] uppercase tracking-wide">
                      Unlock →
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {PRO_DEALS.map((deal, i) => (
                    <div key={i} className="relative">
                      <LiquidGlassCard className="border-[#F39C12]/30">
                        <div className="flex items-start gap-3 mb-2">
                          <span className="text-3xl">{deal.flag}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-black px-2 py-0.5 rounded-lg text-white" style={{ backgroundColor: deal.tagColor }}>{deal.tag}</span>
                            </div>
                            <div className="font-black text-[#001F3F] text-base">{deal.from} → {deal.to}</div>
                            <div className="text-xs text-[#001F3F]/50">{deal.departure} · {deal.airlines.join(', ')}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-[#00A854]">₹{deal.price.toLocaleString('en-IN')}</div>
                            <div className="text-xs text-[#001F3F]/30 line-through">₹{deal.original.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                        {isPro ? (
                          <PremiumButton variant="primary" className="w-full mt-2"><Zap size={15} /> Book This Deal</PremiumButton>
                        ) : (
                          <div className="flex gap-2 mt-2">
                            <PremiumButton variant="glass" className="flex-1" onClick={() => setShowUpgrade(true)}>
                              <Lock size={14} /> View Details
                            </PremiumButton>
                            <PremiumButton variant="primary" className="flex-1" onClick={() => setShowUpgrade(true)}>
                              <Crown size={14} /> Go Pro
                            </PremiumButton>
                          </div>
                        )}
                      </LiquidGlassCard>

                      {/* Blur overlay for non-pro */}
                      {!isPro && (
                        <div
                          className="absolute inset-0 rounded-2xl flex items-center justify-center cursor-pointer"
                          style={{ backdropFilter: 'blur(3px)', backgroundColor: 'rgba(255,255,255,0.4)' }}
                          onClick={() => setShowUpgrade(true)}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#001F3F] to-[#0047AB] flex items-center justify-center shadow-xl">
                              <Lock size={22} className="text-white" />
                            </div>
                            <div className="text-xs font-black text-[#001F3F] uppercase tracking-widest">Pro Only · ₹999/yr</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upsell banner for free users */}
            {!isPro && (
              <LiquidGlassCard
                className="bg-gradient-to-r from-[#001F3F] to-[#0047AB] border-none text-white cursor-pointer"
                hoverable
                onClick={() => setShowUpgrade(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F39C12] to-[#E67E22] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Crown size={22} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-white">Unlock 3× More Deals</div>
                    <div className="text-xs text-white/60 font-medium">Mistake fares · Business class · Peak season alerts</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="px-3 py-1.5 rounded-xl bg-[#F39C12] text-white text-xs font-black">₹999/yr</div>
                  </div>
                </div>
              </LiquidGlassCard>
            )}

            {/* Warning for mistake fares */}
            <LiquidGlassCard className="border-[#FF6B6B]/20">
              <div className="flex gap-3 items-start">
                <AlertTriangle size={18} className="text-[#F39C12] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#001F3F]/60 font-medium leading-relaxed">
                  <span className="font-black text-[#001F3F]">Mistake fares disappear within hours.</span> Pro members get notified within minutes of detection. Free users see them 24 hours later (if they're still available).
                </p>
              </div>
            </LiquidGlassCard>

            <PremiumButton variant="glass" className="w-full" onClick={loadDeals} disabled={isLoading}>
              <Sparkles size={16} />
              {isLoading ? 'Hunting...' : 'Refresh All Deals'}
            </PremiumButton>
          </>
        )}
      </div>

      {showUpgrade && <ProUpgradeModal onClose={() => setShowUpgrade(false)} trigger="Pro Deals" />}
    </div>
  );
}
