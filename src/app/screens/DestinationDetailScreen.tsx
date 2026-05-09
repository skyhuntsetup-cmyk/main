import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Sparkles, Hotel, Plane, CheckCircle2, ChevronRight, Globe, Info } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { fetchDestinationById, TrendingDestination } from '../../lib/discoveryApi';
import { AIRPORTS } from '../../data/airports';
import { useStore } from '../../store/useStore';

export function DestinationDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useStore(state => state.user);
  const homeAirportCode = user?.homeAirport?.match(/\((\w+)\)/)?.[1] || 'DEL';
  
  const [dest, setDest] = useState<TrendingDestination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDest = async () => {
      if (id) {
        const data = await fetchDestinationById(id);
        setDest(data);
      }
      setIsLoading(false);
    };
    loadDest();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0047AB]"></div>
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-black text-[#001F3F] mb-4">Destination not found</h2>
        <PremiumButton onClick={() => navigate(-1)}>Go Back</PremiumButton>
      </div>
    );
  }

  const handleFlightSearch = () => {
    const fromAirport = AIRPORTS.find(a => a.code === homeAirportCode) || AIRPORTS.find(a => a.code === 'DEL')!;
    const toAirport = AIRPORTS.find(a => a.code === dest.airportCode) || AIRPORTS.find(a => a.code === 'LHR')!;
    
    const searchParams = {
      from: fromAirport,
      to: toAirport,
      departDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], // 2 weeks out
      returnDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
      adults: 1,
      children: 0,
      infants: 0,
      cabin: 'economy',
      tripType: 'round-trip'
    };

    navigate('/loading', { state: searchParams });
  };

  const handleHotelSearch = () => {
    // Navigate to a hotel search or external link
    // For now, let's say we have a Hotels screen or just open a pre-filled link
    const query = encodeURIComponent(`${dest.name}, ${dest.country} hotels`);
    window.open(`https://www.google.com/travel/hotels?q=${query}`, '_blank');
  };

  const moodColors: Record<string, string> = {
    'Adventure': 'from-[#FF6B6B] to-[#EE5253]',
    'Relax': 'from-[#48DBFB] to-[#00D2D3]',
    'Culture': 'from-[#FDCB6E] to-[#E17055]',
    'Luxury': 'from-[#A29BFE] to-[#6C5CE7]',
    'Wellness': 'from-[#55E6C1] to-[#1DD1A1]',
  };

  const activeColor = moodColors[dest.mood] || 'from-[#0047AB] to-[#001F3F]';

  return (
    <div className="min-h-screen bg-[#F0F4F8] pb-24">
      {/* Dynamic Header/Hero */}
      <div className={`relative h-80 bg-gradient-to-br ${activeColor} flex flex-col justify-end p-6 overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-16 -mt-16" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-12 left-6 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 z-20">
          <ArrowLeft size={20} />
        </button>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
              {dest.mood} Choice
            </span>
            <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
              <Clock size={10} /> {dest.suggestedDays} Days
            </span>
          </div>
          <h1 className="text-5xl font-black text-white mb-1">{dest.name}</h1>
          <div className="flex items-center gap-1.5 text-white/80 font-bold uppercase tracking-wider text-xs">
            <Globe size={12} /> {dest.country} · {dest.airportCode}
          </div>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20 space-y-6">
        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <LiquidGlassCard className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0047AB]/10 flex items-center justify-center text-[#0047AB]">
              <Calendar size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black text-[#001F3F]/40 uppercase tracking-widest">Best Time</div>
              <div className="text-xs font-bold text-[#001F3F]">{dest.bestTime}</div>
            </div>
          </LiquidGlassCard>
          <LiquidGlassCard className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A854]/10 flex items-center justify-center text-[#00A854]">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black text-[#001F3F]/40 uppercase tracking-widest">Budget</div>
              <div className="text-xs font-bold text-[#001F3F]">{dest.budgetScore}</div>
            </div>
          </LiquidGlassCard>
        </div>

        {/* AI Description */}
        <LiquidGlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info size={18} className="text-[#0047AB]" />
            <h2 className="text-lg font-black text-[#001F3F]">Overview</h2>
          </div>
          <p className="text-[#001F3F]/70 text-sm font-medium leading-relaxed mb-6">
            {dest.description}
          </p>
          
          <div className="bg-[#0047AB]/5 border border-[#0047AB]/10 rounded-2xl p-4 italic">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-[#0047AB]" />
              <span className="text-xs font-black text-[#0047AB] uppercase tracking-widest">AI Expert Recommendation</span>
            </div>
            <p className="text-[#001F3F]/80 text-sm font-medium leading-relaxed">
              "{dest.aiInsight}"
            </p>
          </div>
        </LiquidGlassCard>

        {/* Must Visit Places */}
        <section>
          <h2 className="text-xl font-black text-[#001F3F] mb-4 flex items-center gap-2 px-1">
            <MapPin size={20} className="text-[#EE5253]" />
            Must Visit Places
          </h2>
          <div className="space-y-3">
            {dest.mustVisitPlaces.map((place, idx) => (
              <LiquidGlassCard key={idx} className="p-4 flex items-center justify-between group hover:border-[#0047AB]/30">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#001F3F] font-black text-xs">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-bold text-[#001F3F]">{place}</span>
                </div>
                <CheckCircle2 size={18} className="text-[#00A854] opacity-0 group-hover:opacity-100 transition-opacity" />
              </LiquidGlassCard>
            ))}
          </div>
        </section>

        {/* Local Secret */}
        <LiquidGlassCard className="bg-gradient-to-br from-[#F39C12] to-[#E67E22] border-none text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black mb-1">Local Secret</h3>
              <p className="text-white/90 text-sm font-medium leading-relaxed">
                {dest.localSecret}
              </p>
            </div>
          </div>
        </LiquidGlassCard>

        {/* Search Buttons */}
        <div className="pt-4 space-y-3 pb-8">
          <PremiumButton 
            variant="primary" 
            className="w-full h-16 rounded-2xl flex items-center justify-between px-6 shadow-xl"
            onClick={handleFlightSearch}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Plane size={24} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-70">Starting from ₹{dest.priceStart?.toLocaleString('en-IN')}</div>
                <div className="text-base font-black">Search Best Flights</div>
              </div>
            </div>
            <ChevronRight size={24} />
          </PremiumButton>

          <PremiumButton 
            variant="glass" 
            className="w-full h-16 rounded-2xl flex items-center justify-between px-6 border-[#001F3F]/10 text-[#001F3F]"
            onClick={handleHotelSearch}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#0047AB]/10 flex items-center justify-center text-[#0047AB]">
                <Hotel size={24} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Prefilled for {dest.name}</div>
                <div className="text-base font-black text-[#001F3F]">Find Top Hotels</div>
              </div>
            </div>
            <ChevronRight size={24} className="text-[#001F3F]/30" />
          </PremiumButton>
        </div>
      </div>
    </div>
  );
}
