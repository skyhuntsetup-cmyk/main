import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MapPin, ArrowRight, RefreshCw, Star, Info, Heart, Zap, Brain, Calendar, Globe } from 'lucide-react';
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
  const [activeCategory, setActiveCategory] = useState('Global');

  const categories = ['Global', 'Asia', 'Europe', 'Beach', 'Culture', 'Luxury'];

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
    const fromAirport = AIRPORTS.find(a => a.code === homeAirportCode) || AIRPORTS.find(a => a.code === 'DEL')!;
    const toAirport = AIRPORTS.find(a => a.code === dest.airportCode) || AIRPORTS.find(a => a.code === 'LHR')!;
    
    // Set search state and navigate to loading
    const searchParams = {
      from: fromAirport,
      to: toAirport,
      departDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], // Default 7 days away
      returnDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      passengers: 1,
      cabin: cabinPreference,
      tripType: 'one-way'
    };

    navigate('/loading', { state: searchParams });
  };

  const filteredDestinations = destinations.filter(d => {
    if (activeCategory === 'Global') return true;
    if (activeCategory === 'Asia' && d.region === 'Asia') return true;
    if (activeCategory === 'Europe' && d.region === 'Europe') return true;
    if (activeCategory === 'Beach' && (d.description.toLowerCase().includes('beach') || d.name === 'Bali')) return true;
    if (activeCategory === 'Culture' && (d.description.toLowerCase().includes('culture') || d.name === 'Kyoto')) return true;
    if (activeCategory === 'Luxury' && (d.description.toLowerCase().includes('luxury') || d.name === 'Dubai')) return true;
    return false;
  });

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
          <div 
            onClick={() => handleTileClick(filteredDestinations[0])}
            className="relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#001F3F]/90 via-[#001F3F]/20 to-transparent z-10 rounded-3xl pointer-events-none" />
            <img 
              src={filteredDestinations[0].imageUrl} 
              alt={filteredDestinations[0].name}
              className="w-full h-[480px] object-cover rounded-3xl shadow-2xl transition-transform duration-700 group-hover:scale-105"
            />
            
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-[#00F5FF]/20 backdrop-blur-md border border-[#00F5FF]/30 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 self-start">
                <Star size={10} className="fill-[#00F5FF] text-[#00F5FF]" />
                AI Featured
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={10} className="text-white" />
                Best in {filteredDestinations[0].bestTime}
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="flex items-center gap-1.5 text-[#00F5FF] font-black text-xs uppercase tracking-widest mb-2">
                <MapPin size={12} />
                {filteredDestinations[0].region} · {filteredDestinations[0].airportCode}
              </div>
              <h2 className="text-4xl font-black text-white mb-2">{filteredDestinations[0].name}</h2>
              
              {/* AI Insight Box */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#00F5FF]/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={14} className="text-[#00F5FF]" />
                  </div>
                  <p className="text-white/90 text-sm font-medium italic leading-relaxed">
                    "{filteredDestinations[0].aiInsight}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <PremiumButton variant="primary" className="flex-1 h-12 shadow-[0_8px_20px_rgba(0,71,171,0.4)]">
                   Find Best Flights <ArrowRight size={18} className="ml-2" />
                </PremiumButton>
                <button className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:bg-white/40 transition-colors">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </div>
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
                <div key={i} className="h-64 rounded-3xl bg-white/30 animate-pulse border border-[#001F3F]/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredDestinations.slice(1, 5).map((dest) => (
                <div 
                  key={dest.id} 
                  onClick={() => handleTileClick(dest)}
                  className="relative aspect-[3/4] group overflow-hidden rounded-3xl cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001F3F]/80 via-transparent to-transparent z-10" />
                  <img 
                    src={dest.imageUrl} 
                    alt={dest.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 z-20">
                    <div className="px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 text-[8px] font-black text-white uppercase tracking-tighter">
                      {dest.airportCode}
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 z-20">
                    <div className="text-[10px] text-[#00F5FF] font-black uppercase mb-0.5">{dest.country}</div>
                    <div className="text-lg font-black text-white leading-tight mb-1">{dest.name}</div>
                    <div className="text-[10px] font-bold text-white/60">From ₹{dest.priceStart?.toLocaleString('en-IN')}</div>
                  </div>
                </div>
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
