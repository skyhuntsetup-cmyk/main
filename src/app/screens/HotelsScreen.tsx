import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, MapPin, Star, Loader2, Hotel, Building2, Navigation, Calendar, Users, Home, Baby } from 'lucide-react';
import { LiquidGlassCard } from '../components/LiquidGlassCard';
import { PremiumButton } from '../components/PremiumButton';
import { searchHotels, resolveDestination } from '../../lib/hotelApi';

export function HotelsScreen() {
  const location = useLocation();
  const prefilledCity = location.state?.city || '';

  const [query, setQuery] = useState(prefilledCity);
  const [checkin, setCheckin] = useState(new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]); // Default 7 days out
  const [checkout, setCheckout] = useState(new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0]); // Default 9 days out
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (prefilledCity) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!query) {
      alert('Please enter a destination');
      return;
    }
    setLoading(true);
    setSearching(true);
    
    try {
      const destination = await resolveDestination(query);
      if (destination) {
        const results = await searchHotels({
          dest_id: destination.dest_id,
          search_type: destination.search_type || 'CITY',
          arrival_date: checkin,
          departure_date: checkout,
          adults: String(adults),
          room_qty: String(rooms),
          children_age: children > 0 ? Array(children).fill('8').join(',') : undefined
        });
        setHotels(results);
      } else {
        alert('Could not find that destination. Please try another city.');
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
        <p className="text-sm text-[#001F3F]/50 font-medium">Live availability from Booking.com & more.</p>
      </div>

      {/* Search Bar */}
      <LiquidGlassCard className="mb-8 p-5 border-[#0047AB]/20 shadow-2xl">
        <div className="space-y-5">
          {/* Destination */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest ml-1">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]" size={18} />
              <input 
                type="text" 
                placeholder="Where to?"
                className="w-full bg-[#001F3F]/5 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[#001F3F] focus:ring-2 focus:ring-[#0047AB]/20 transition-all placeholder:text-[#001F3F]/30"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest ml-1">Check-in</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]/50" size={16} />
                <input 
                  type="date" 
                  className="w-full bg-[#001F3F]/5 border-none rounded-2xl py-3 pl-12 pr-3 text-xs font-bold text-[#001F3F]"
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest ml-1">Check-out</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0047AB]/50" size={16} />
                <input 
                  type="date" 
                  className="w-full bg-[#001F3F]/5 border-none rounded-2xl py-3 pl-12 pr-3 text-xs font-bold text-[#001F3F]"
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Guests & Rooms */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest ml-1">Adults</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0047AB]/50" size={14} />
                <select 
                  className="w-full bg-[#001F3F]/5 border-none rounded-2xl py-3 pl-9 pr-2 text-[11px] font-bold text-[#001F3F] appearance-none"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value))}
                >
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Ad.</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest ml-1">Children</label>
              <div className="relative">
                <Baby className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0047AB]/50" size={14} />
                <select 
                  className="w-full bg-[#001F3F]/5 border-none rounded-2xl py-3 pl-9 pr-2 text-[11px] font-bold text-[#001F3F] appearance-none"
                  value={children}
                  onChange={(e) => setChildren(parseInt(e.target.value))}
                >
                  {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} Ch.</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#0047AB] uppercase tracking-widest ml-1">Rooms</label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0047AB]/50" size={14} />
                <select 
                  className="w-full bg-[#001F3F]/5 border-none rounded-2xl py-3 pl-9 pr-2 text-[11px] font-bold text-[#001F3F] appearance-none"
                  value={rooms}
                  onChange={(e) => setRooms(parseInt(e.target.value))}
                >
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n} Rm.</option>)}
                </select>
              </div>
            </div>
          </div>
          
          <PremiumButton 
            variant="primary" 
            className="w-full h-14 shadow-lg shadow-[#0047AB]/20" 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <div className="flex items-center gap-2"><Search size={20} /> Search Properties</div>}
          </PremiumButton>
        </div>
      </LiquidGlassCard>

      {/* Results */}
      {searching && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xs font-black text-[#001F3F] uppercase tracking-widest">
              {loading ? 'Analyzing properties...' : `${hotels.length} places in ${query}`}
            </h2>
            {!loading && <div className="text-[10px] font-bold text-[#0047AB] bg-[#0047AB]/5 px-2 py-1 rounded-full uppercase">Live Availability</div>}
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
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md flex items-center gap-1.5 shadow-lg border border-white/20">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-black text-[#001F3F]">{hotel.rating || 'New'}</span>
                  </div>
                  {hotel.price < 5000 && (
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-[#00A854] text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Best Value
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 pr-4">
                      <h3 className="font-black text-[#001F3F] text-lg leading-tight line-clamp-1">{hotel.hotel_name}</h3>
                      <div className="flex items-center gap-1 text-[#001F3F]/50 mt-1">
                        <Navigation size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">{hotel.distance}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#0047AB]">{hotel.currency === 'INR' ? '₹' : '$'}{hotel.price.toLocaleString()}</div>
                      <div className="text-[9px] text-[#001F3F]/40 font-black uppercase tracking-widest">Total Price</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-5 pt-5 border-t border-[#001F3F]/5">
                    <PremiumButton 
                      variant="glass" 
                      className="flex-1 h-12"
                      onClick={() => window.open(hotel.url, '_blank')}
                    >
                      Details
                    </PremiumButton>
                    <PremiumButton 
                      variant="primary" 
                      className="flex-[1.5] h-12"
                      onClick={() => window.open(hotel.url, '_blank')}
                    >
                      Book Now
                    </PremiumButton>
                  </div>
                </div>
              </LiquidGlassCard>
            ))
          ) : (
            <div className="text-center py-20 px-10 rounded-3xl border-2 border-dashed border-[#001F3F]/10">
              <Building2 size={48} className="mx-auto text-[#001F3F]/10 mb-4" />
              <p className="text-[#001F3F]/50 font-medium">No properties found. Try adjusting your dates or city.</p>
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
            <LiquidGlassCard key={cat.name} hoverable className="text-center py-6 border-[#0047AB]/5">
              <span className="text-3xl mb-2 block">{cat.icon}</span>
              <div className="text-xs font-black text-[#001F3F] uppercase tracking-widest">{cat.name}</div>
            </LiquidGlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
