import { useState } from 'react';
import { Search, MapPin, Star, Loader2, Hotel, Building2, Navigation } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { searchHotels, resolveDestination } from '../../lib/hotelApi';

export function HotelsScreen() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setSearching(true);
    
    try {
      const destination = await resolveDestination(query);
      if (destination) {
        // Mocking dates for now, could be added to UI
        const today = new Date();
        const checkin = today.toISOString().split('T')[0];
        const checkout = new Date(today.setDate(today.getDate() + 3)).toISOString().split('T')[0];
        
        const results = await searchHotels({
          dest_id: destination.dest_id,
          search_type: destination.search_type,
          arrival_date: checkin,
          departure_date: checkout,
          adults: '2',
          room_qty: '1'
        });
        setHotels(results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-5 pt-14 pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#001F3F] leading-tight mb-2">
          Find Your <br />
          <span className="bg-gradient-to-r from-[#0047AB] to-[#00B8D4] bg-clip-text text-transparent">
            Dream Stay 🏨
          </span>
        </h1>
        <p className="text-sm text-[#001F3F]/50 font-medium">Curated hotels, villas, and hidden gems.</p>
      </div>

      {/* Search Bar */}
      <LiquidGlassCard className="mb-8 p-4 border-[#0047AB]/20">
        <div className="space-y-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
            <input 
              type="text" 
              placeholder="Where do you want to stay?"
              className="w-full bg-[#001F3F]/5 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[#001F3F] focus:ring-2 focus:ring-[#0047AB]/20 transition-all placeholder:text-[#001F3F]/30"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <PremiumButton 
            variant="primary" 
            className="w-full h-14" 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-2"><Search size={20} /> Find Hotels</div>}
          </PremiumButton>
        </div>
      </LiquidGlassCard>

      {/* Results */}
      {searching && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-[#001F3F] uppercase tracking-widest">
              {loading ? 'Searching...' : `${hotels.length} Properties Found`}
            </h2>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#0047AB] to-[#00F5FF] flex items-center justify-center shadow-xl animate-bounce">
                <Hotel size={32} className="text-white" />
              </div>
              <p className="text-sm font-black text-[#0047AB] animate-pulse uppercase tracking-widest">Matching your vibe...</p>
            </div>
          ) : hotels.length > 0 ? (
            hotels.map((hotel) => (
              <LiquidGlassCard key={hotel.hotel_id} className="overflow-hidden p-0 border-[#0047AB]/10" hoverable>
                <div className="relative h-48">
                  <img src={hotel.main_photo_url} alt={hotel.hotel_name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-black text-[#001F3F]">{hotel.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-black text-[#001F3F] text-lg leading-tight">{hotel.hotel_name}</h3>
                      <div className="flex items-center gap-1 text-[#001F3F]/50 mt-1">
                        <Navigation size={12} />
                        <span className="text-xs font-medium">{hotel.distance} from center</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#0047AB]">${hotel.price}</div>
                      <div className="text-[10px] text-[#001F3F]/40 font-bold uppercase tracking-wide">per night</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#001F3F]/5">
                    <PremiumButton 
                      variant="glass" 
                      className="flex-1"
                      onClick={() => window.open(hotel.url, '_blank')}
                    >
                      View Details
                    </PremiumButton>
                    <PremiumButton 
                      variant="primary" 
                      className="px-6"
                      onClick={() => window.open(hotel.url, '_blank')}
                    >
                      Book
                    </PremiumButton>
                  </div>
                </div>
              </LiquidGlassCard>
            ))
          ) : (
            <div className="text-center py-20 px-10 rounded-3xl border-2 border-dashed border-[#001F3F]/10">
              <Building2 size={48} className="mx-auto text-[#001F3F]/10 mb-4" />
              <p className="text-[#001F3F]/50 font-medium">No properties found in this area. Try a different city.</p>
            </div>
          )}
        </div>
      )}

      {/* Categories */}
      {!searching && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { name: 'Luxury Stay', icon: '💎', color: 'from-[#0047AB] to-[#00B8D4]' },
            { name: 'Beachfront', icon: '🏖️', color: 'from-[#FF6B6B] to-[#f15959]' },
            { name: 'City Center', icon: '🏙️', color: 'from-[#001F3F] to-[#0047AB]' },
            { name: 'Hidden Gem', icon: '🌿', color: 'from-[#00A854] to-[#008f47]' },
          ].map((cat) => (
            <LiquidGlassCard key={cat.name} hoverable className="text-center py-6">
              <span className="text-3xl mb-2 block">{cat.icon}</span>
              <div className="text-sm font-black text-[#001F3F] uppercase tracking-tight">{cat.name}</div>
            </LiquidGlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
