import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Filter, ExternalLink, ShieldCheck, AlertTriangle, X } from 'lucide-react';
import { EnhancedFlightCard } from '../components/EnhancedFlightCard';
import { PremiumButton } from '../components/PremiumButton';
import type { FlightResult } from '../../lib/flightApi';
import type { SearchState } from './SearchScreen';

interface ResultsScreenProps {
  onBack?: () => void;
}

const mockFlights = [
  {
    id: 'mock-1',
    airline: 'IndiGo',
    departureTime: '08:30',
    arrivalTime: '20:15',
    duration: '23h',
    stops: '2 stops (4h in Dubai)',
    price: 41200,
    savings: 3200,
    rating: 4.2,
    reviews: 2400,
    delay: 0,
    isMonitoring: true,
  },
  {
    id: 'mock-2',
    airline: 'Air India',
    departureTime: '10:00',
    arrivalTime: '22:30',
    duration: '24h 30m',
    stops: '1 stop (3h in Frankfurt)',
    price: 43500,
    savings: 1500,
    rating: 4.0,
    reviews: 1800,
    delay: 12,
    isMonitoring: false,
  },
  {
    id: 'mock-3',
    airline: 'Emirates',
    departureTime: '14:30',
    arrivalTime: '01:45+1',
    duration: '23h 15m',
    stops: '1 stop (2h in Dubai)',
    price: 48900,
    rating: 4.5,
    reviews: 3200,
    delay: 0,
    isMonitoring: false,
  },
  {
    id: 'mock-4',
    airline: 'British Airways',
    departureTime: '16:00',
    arrivalTime: '02:30+1',
    duration: '22h 30m',
    stops: 'Non-stop',
    price: 52000,
    rating: 4.3,
    reviews: 2100,
    delay: 0,
    isMonitoring: false,
  },
];

const sortOptions = ['Cheapest', 'Fastest', 'Best rated', 'Non-stop'];

export function ResultsScreen({ onBack }: ResultsScreenProps) {
  const location = useLocation();
  const state = location.state as { searchState?: SearchState, flights?: FlightResult[] } | null;
  const searchState = state?.searchState;
  const apiFlights = state?.flights;

  const [sortBy, setSortBy] = useState('Cheapest');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);
  const [bookingFlight, setBookingFlight] = useState<any>(null);

  const rawDisplayFlights = useMemo(() => {
    return apiFlights
      ? apiFlights.map((f, i) => ({
        id: f.id || `flight-${i}`,
        airline: f.airline,
        departureTime: f.departureTime ? new Date(f.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        arrivalTime: f.arrivalTime ? new Date(f.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
        duration: f.duration || 'N/A',
        stops: f.stopDetails || (f.stops === 0 ? 'Non-stop' : `${f.stops} stop(s)`),
        stopsCount: f.stops,
        price: f.price,
        savings: i === 0 ? 3200 : 0,
        rating: 4.5 - (i % 3) * 0.2, // Mock rating logic for display
        reviews: 1200 + Math.floor(Math.random() * 1000),
        delay: 0,
        isMonitoring: i === 0,
        fromCode: f.from,
        toCode: f.to,
        date: f.departureTime?.split('T')[0]
      }))
      : mockFlights.map(m => ({
        ...m,
        stopsCount: m.stops.toLowerCase().includes('non-stop') ? 0 : (parseInt(m.stops) || 1),
        fromCode: searchState?.from?.code || 'DEL',
        toCode: searchState?.to?.code || 'LHR',
        date: searchState?.departDate
      }));
  }, [apiFlights, searchState]);

  const maxPossiblePrice = rawDisplayFlights.length > 0 ? Math.max(...rawDisplayFlights.map(f => f.price)) : 100000;
  const minPossiblePrice = rawDisplayFlights.length > 0 ? Math.min(...rawDisplayFlights.map(f => f.price)) : 0;
  const availableAirlines = Array.from(new Set(rawDisplayFlights.map(f => f.airline)));

  // Filter States
  const [maxPrice, setMaxPrice] = useState(maxPossiblePrice);
  const [maxStops, setMaxStops] = useState<number | null>(null); 
  const [selectedAirline, setSelectedAirline] = useState<string | null>(null);

  // Sorting and Filtering Logic
  const processedFlights = useMemo(() => {
    let result = rawDisplayFlights.filter(f => {
      if (f.price > maxPrice) return false;
      if (maxStops !== null && f.stopsCount > maxStops) return false;
      if (selectedAirline && f.airline !== selectedAirline) return false;
      return true;
    });

    if (sortBy === 'Cheapest') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Fastest') {
      const parseDuration = (d: string) => {
        if (!d || d === 'N/A') return 999999;
        const hMatch = d.match(/(\d+)h/);
        const mMatch = d.match(/(\d+)m/);
        const h = hMatch ? parseInt(hMatch[1], 10) : 0;
        const m = mMatch ? parseInt(mMatch[1], 10) : 0;
        return h * 60 + m;
      };
      result.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
    } else if (sortBy === 'Best rated') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'Non-stop') {
      result = result.filter(f => f.stopsCount === 0);
      result.sort((a, b) => a.price - b.price);
    }
    
    return result;
  }, [rawDisplayFlights, sortBy, maxPrice, maxStops, selectedAirline]);

  const handleBookRedirect = (flight: any) => {
    // Generate Google Flights deep link as a robust fallback
    const from = flight.fromCode || 'DEL';
    const to = flight.toCode || 'LHR';
    const date = flight.date || new Date().toISOString().split('T')[0];
    const url = `https://www.google.com/travel/flights/search?tfs=CBwQAhoeagwIAhIHL20vMGRseHISCjIwMjYtMDYtMjZyBwgBEgNMSFJAAVABYAGCAQsI____________AZgBAg&hl=en&curr=INR&f=${from}&t=${to}&d=${date}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
    setBookingFlight(null);
  };

  const displayDate = searchState?.departDate
    ? new Date(searchState.departDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'May 15, 2026';

  return (
    <div className="min-h-screen pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 px-4 pt-12 pb-3 bg-[#F0F4F8]/95 backdrop-blur-sm border-b border-[#001F3F]/5">
        <div className="flex items-center gap-3 mb-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl bg-white border border-[#001F3F]/10 flex items-center justify-center shadow-sm"
            >
              <ArrowLeft size={18} className="text-[#001F3F]" />
            </button>
          )}
          <div className="flex-1">
            <div className="font-black text-[#001F3F] text-lg leading-tight">
              {searchState ? `${searchState.from.city} → ${searchState.to.city}` : 'Delhi → London'}
            </div>
            <div className="text-xs text-[#001F3F]/50 font-medium">
              {displayDate} · {searchState?.passengers || 1} passenger{searchState?.passengers !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="px-3 py-1 rounded-xl bg-[#00A854]/10 border border-[#00A854]/20 shadow-sm">
            <span className="text-xs font-black text-[#00A854]">{processedFlights.length} found</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${
              showFilters 
                ? 'bg-[#001F3F] text-white border-[#001F3F]' 
                : 'bg-white border-[#001F3F]/10 text-[#001F3F]'
            }`}
          >
            <Filter size={14} />
            Filter
            {(maxPrice < maxPossiblePrice || maxStops !== null || selectedAirline !== null) && (
              <span className="w-2 h-2 rounded-full bg-[#FF6B6B]"></span>
            )}
          </button>
          <div className="flex gap-2 overflow-x-auto flex-1 no-scrollbar">
            {sortOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  setSortBy(opt);
                  setVisibleCount(5);
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${
                  sortBy === opt
                    ? 'bg-gradient-to-r from-[#0047AB] to-[#00F5FF] text-white border-transparent scale-105'
                    : 'bg-white border-[#001F3F]/10 text-[#001F3F]/60 hover:bg-[#001F3F]/5'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="px-4 py-4 bg-white/80 backdrop-blur-xl border-b border-[#001F3F]/5 animate-slide-up sticky top-[125px] z-20 shadow-xl">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-black text-[#001F3F] uppercase tracking-wider">Refine Results</h3>
            <button 
              onClick={() => {
                setMaxPrice(maxPossiblePrice);
                setMaxStops(null);
                setSelectedAirline(null);
              }}
              className="text-xs font-bold text-[#FF6B6B]"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black text-[#001F3F]/60 uppercase tracking-widest">Max Budget</span>
                <span className="text-sm font-black text-[#00A854]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range" 
                min={minPossiblePrice} 
                max={maxPossiblePrice} 
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-2 bg-[#001F3F]/10 rounded-lg appearance-none cursor-pointer accent-[#00A854]" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-black text-[#001F3F]/60 uppercase tracking-widest mb-3 block">Max Stops</span>
                <div className="flex gap-2">
                  {[
                    { label: 'Any', value: null },
                    { label: 'Non-stop', value: 0 },
                    { label: '1 Stop', value: 1 }
                  ].map(stopOpt => (
                    <button 
                      key={stopOpt.label}
                      onClick={() => setMaxStops(stopOpt.value)}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-black transition-all border ${
                        maxStops === stopOpt.value 
                          ? 'bg-[#0047AB] border-[#0047AB] text-white shadow-md' 
                          : 'bg-white border-[#001F3F]/10 text-[#001F3F]/50'
                      }`}
                    >
                      {stopOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-black text-[#001F3F]/60 uppercase tracking-widest mb-3 block">Airline</span>
                <select 
                  value={selectedAirline || ''} 
                  onChange={(e) => setSelectedAirline(e.target.value || null)}
                  className="w-full py-2 px-3 rounded-xl bg-white border border-[#001F3F]/10 text-xs font-black text-[#001F3F] focus:outline-none focus:border-[#0047AB]"
                >
                  <option value="">All Airlines</option>
                  {availableAirlines.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            
            <PremiumButton variant="primary" className="w-full" onClick={() => setShowFilters(false)}>
              Show {processedFlights.length} Flights
            </PremiumButton>
          </div>
        </div>
      )}

      {/* Flight list */}
      <div className="px-4 pt-4 pb-8 space-y-4">
        {processedFlights.length > 0 ? (
          <>
            {processedFlights.slice(0, visibleCount).map((flight) => (
              <EnhancedFlightCard
                key={flight.id}
                {...flight}
                onBook={() => setBookingFlight(flight)}
              />
            ))}

            {visibleCount < processedFlights.length && (
              <button
                className="w-full py-4 rounded-2xl bg-white border border-[#001F3F]/10 text-xs font-black text-[#001F3F] uppercase tracking-widest hover:bg-[#001F3F]/5 transition-colors"
                onClick={() => setVisibleCount(v => v + 5)}
              >
                Load More Flights ({processedFlights.length - visibleCount} left)
              </button>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-[#001F3F]/5 flex items-center justify-center mx-auto mb-6">
              <Filter size={32} className="text-[#001F3F]/20" />
            </div>
            <h3 className="text-xl font-black text-[#001F3F]">No matches found</h3>
            <p className="text-sm text-[#001F3F]/40 font-medium mt-2 max-w-[200px] mx-auto">Try relaxing your filters or changing your dates.</p>
            <button 
              onClick={() => {
                setMaxPrice(maxPossiblePrice);
                setMaxStops(null);
                setSelectedAirline(null);
                setShowFilters(false);
              }}
              className="mt-6 px-6 py-3 bg-[#001F3F] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Booking Disclaimer Modal */}
      {bookingFlight && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 pt-4 bg-[#001F3F]/40 backdrop-blur-md">
          <div className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#0047AB]/10 flex items-center justify-center">
                  <ShieldCheck size={24} className="text-[#0047AB]" />
                </div>
                <button 
                  onClick={() => setBookingFlight(null)}
                  className="w-10 h-10 rounded-full bg-[#001F3F]/5 flex items-center justify-center text-[#001F3F]/40"
                >
                  <X size={20} />
                </button>
              </div>

              <h2 className="text-2xl font-black text-[#001F3F] leading-tight mb-3">
                Ready to Book?
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex gap-3 items-start p-4 rounded-2xl bg-[#F0F4F8] border border-[#001F3F]/5">
                  <AlertTriangle size={18} className="text-[#F39C12] mt-0.5" />
                  <p className="text-xs text-[#001F3F]/70 font-medium leading-relaxed">
                    You are now leaving Sky Hunt. We've found this deal for you, but the actual booking happens directly on the airline or partner website.
                  </p>
                </div>
                
                <ul className="space-y-2">
                  {[
                    'Direct booking with the airline',
                    'Prices are subject to availability',
                    '256-bit SSL secure redirection'
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-[#001F3F]/50 uppercase tracking-wide">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00A854]" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <PremiumButton 
                  variant="primary" 
                  size="large" 
                  onClick={() => handleBookRedirect(bookingFlight)}
                >
                  Confirm & Redirect <ExternalLink size={18} className="ml-2" />
                </PremiumButton>
                <button 
                  onClick={() => setBookingFlight(null)}
                  className="w-full py-4 text-xs font-black text-[#001F3F]/40 uppercase tracking-widest"
                >
                  Stay Here
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
