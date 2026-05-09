import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, ArrowRight, RefreshCw, Info, Heart, Zap, Brain, Calendar, Globe, Cloud } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { fetchTrendingDestinations, TrendingDestination } from '../../lib/discoveryApi';
import { fetchLiveDeals, Deal } from '../../lib/dealsApi';
import { useStore } from '../../store/useStore';
import { AIRPORTS } from '../../data/airports';

export function DiscoverScreen() {
  const user = useStore(state => state.user);
  const navigate = useNavigate();
  const homeAirportCode = user?.homeAirport?.match(/\((\w+)\)/)?.[1] || 'DEL';
  const cabinPreference = user?.dealPreferences?.cabinClass || 'economy';
  
  const [destinations, setDestinations] = useState<TrendingDestination[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Adventure', 'Relax', 'Culture', 'Luxury', 'Wellness'];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const destData = await fetchTrendingDestinations();
      setDestinations(destData);
    } catch (err) {
      console.error('Failed to load destinations:', err);
    }

    try {
      const dealData = await fetchLiveDeals(homeAirportCode);
      if (dealData && dealData.flashSales) {
        setDeals(dealData.flashSales);
      }
    } catch (err) {
      console.error('Failed to load deals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTileClick = (dest: TrendingDestination) => {
    navigate(`/discover/${dest.id}`);
  };

  const filteredDestinations = destinations.filter(d => {
    if (activeCategory === 'All') return true;
    return d.mood === activeCategory;
  });

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Adventure': return 'from-[#FF6B6B] to-[#EE5253]';
      case 'Relax': return 'from-[#48DBFB] to-[#00D2D3]';
      case 'Culture': return 'from-[#FDCB6E] to-[#E17055]';
      case 'Luxury': return 'from-[#A29BFE] to-[#6C5CE7]';
      case 'Wellness': return 'from-[#55E6C1] to-[#1DD1A1]';
      default: return 'from-[#0047AB] to-[#001F3F]';
    }
  };

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Globe size={14} className="text-[#0047AB] animate-spin-slow" />
              <span className="text-xs font-bold text-[#0047AB] uppercase tracking-widest">Global Explorer</span>
            </div>
            <h1 className="text-3xl font-black text-[#001F3F]">Discover</h1>
            <p className="text-sm text-[#001F3F]/50 font-medium mt-1">AI-curated gems and secret deals</p>
          </div>
          <button 
            onClick={loadData}
            className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-md flex items-center justify-center border border-white/60 shadow-sm">
            <RefreshCw size={20} className={`text-[#0047AB] ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-6 no-scrollbar">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeCategory === cat 
              ? 'bg-[#001F3F] text-white shadow-lg scale-105' 
              : 'bg-white/40 backdrop-blur-sm border border-white/60 text-[#001F3F]/50 hover:bg-white/60'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* AI Itinerary Master CTA */}
      <div className="px-5 mb-8">
        <LiquidGlassCard hoverable onClick={() => navigate('/itinerary')} className="border-[#00F5FF]/20 bg-gradient-to-br from-[#001F3F] to-[#0047AB] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F5FF]/10 blur-3xl -mr-16 -mt-16" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg flex-shrink-0">
              <Brain size={22} className="text-[#00F5FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-white text-base">AI Itinerary Master</div>
              <div className="text-sm text-white/70 font-medium">Daily plans · Visa hacks · Budget tips</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-[#00F5FF] text-[#001F3F] text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,245,255,0.4)]">
              Try
            </div>
          </div>
        </LiquidGlassCard>
      </div>

      <div className="px-5 space-y-8">
        {/* Featured Card */}
        {!isLoading && filteredDestinations.length > 0 && (
          <LiquidGlassCard 
            hoverable
            onClick={() => handleTileClick(filteredDestinations[0])}
            className={`border-none bg-gradient-to-br ${getMoodColor(filteredDestinations[0].mood)} text-white p-6 min-h-[320px] flex flex-col justify-between`}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={10} className="text-white" />
                Featured {filteredDestinations[0].mood}
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={10} />
                Best in {filteredDestinations[0].bestTime}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-white/70 font-black text-xs uppercase tracking-widest mb-1">
                <MapPin size={12} />
                {filteredDestinations[0].region} · {filteredDestinations[0].airportCode}
              </div>
              <h2 className="text-4xl font-black text-white mb-4">{filteredDestinations[0].name}</h2>
              
              <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-2 mb-1">
                  <Brain size={14} className="text-white" />
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">AI Insight</span>
                </div>
                <p className="text-white/90 text-sm font-medium italic leading-relaxed">
                  "{filteredDestinations[0].aiInsight}"
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white">₹{filteredDestinations[0].priceStart?.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-white/60 font-bold uppercase tracking-widest">starting</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white text-[#001F3F] text-xs font-black uppercase tracking-widest">
                  Explore
                </div>
              </div>
            </div>
          </LiquidGlassCard>
        )}

        {/* Trending Grid */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#F39C12]" />
              <h2 className="text-lg font-black text-[#001F3F]">Trending Now</h2>
            </div>
            <button className="text-xs font-black text-[#0047AB] uppercase tracking-wider">See All</button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 rounded-3xl bg-white/30 animate-pulse border border-[#001F3F]/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredDestinations.slice(1, 5).map((dest) => (
                <LiquidGlassCard 
                  key={dest.id} 
                  hoverable
                  onClick={() => handleTileClick(dest)}
                  className={`aspect-square p-4 flex flex-col justify-between border-none bg-gradient-to-br ${getMoodColor(dest.mood)} text-white`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <MapPin size={14} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/70">{dest.airportCode}</span>
                  </div>

                  <div>
                    <div className="text-[9px] font-black uppercase tracking-tighter text-white/60 mb-0.5">{dest.country}</div>
                    <div className="text-lg font-black text-white leading-tight mb-2 truncate">{dest.name}</div>
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-white">₹{Math.floor(dest.priceStart! / 1000)}K+</div>
                      <ArrowRight size={14} className="text-white/60" />
                    </div>
                  </div>
                </LiquidGlassCard>
              ))}
            </div>
          )}
        </section>

        {/* Exclusive Deals */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-[#FF6B6B]" />
              <h2 className="text-lg font-black text-[#001F3F]">Exclusive Deals</h2>
            </div>
            <button className="text-xs font-black text-[#0047AB] uppercase tracking-wider">View All</button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              [1, 2].map(i => <div key={i} className="h-32 rounded-3xl bg-white/30 animate-pulse" />)
            ) : (
              deals.map((deal) => (
                <LiquidGlassCard key={deal.id} className="border-[#FF6B6B]/20">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{deal.flag}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-[#001F3F] text-sm truncate">{deal.from} → {deal.to}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-black text-[#00A854]">₹{deal.price.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-lg bg-[#FF6B6B]/10 text-[#FF6B6B]">-{deal.discount}%</span>
                      </div>
                    </div>
                    <PremiumButton 
                      variant="glass" 
                      size="small"
                      onClick={() => navigate('/loading', { 
                        state: { 
                          from: AIRPORTS.find(a => a.code === deal.from) || AIRPORTS.find(a => a.code === 'DEL')!,
                          to: AIRPORTS.find(a => a.code === deal.to) || AIRPORTS.find(a => a.code === 'LHR')!,
                          departDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
                          passengers: 1,
                          cabin: cabinPreference,
                          tripType: 'one-way'
                        } 
                      })}
                    >
                      Book
                    </PremiumButton>
                  </div>
                </LiquidGlassCard>
              ))
            )}
          </div>
        </section>

        {/* Travel Tips Banner */}
        <LiquidGlassCard className="bg-gradient-to-br from-[#0047AB] to-[#00F5FF] border-none text-white relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mb-24 -mr-24" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <Info size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">Traveler Insights</h3>
              <p className="text-white/80 text-sm font-medium mb-4">
                Did you know? Booking flights on a Tuesday at 3 AM can save you up to 12% on international routes.
              </p>
              <button className="text-xs font-black uppercase tracking-widest underline underline-offset-4">Read More Hacks</button>
            </div>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}
