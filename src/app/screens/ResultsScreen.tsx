import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
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

  const rawDisplayFlights = useMemo(() => {
    return apiFlights
      ? apiFlights.map((f, i) => ({
        id: f.id || `flight-${i}`,
        airline: f.airline,
        departureTime: new Date(f.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        arrivalTime: new Date(f.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: f.duration,
        stops: f.stopDetails || (f.stops === 0 ? 'Non-stop' : `${f.stops} stop(s)`),
        stopsCount: f.stops,
        price: f.price,
        savings: i === 0 ? 3200 : 0,
        rating: 4.5 - (i % 3) * 0.2, // Fake varying ratings for sorting
        reviews: 1200 + Math.floor(Math.random() * 1000),
        delay: 0,
        isMonitoring: i === 0
      }))
      : mockFlights.map(m => ({
        ...m,
        stopsCount: m.stops.toLowerCase().includes('non-stop') ? 0 : parseInt(m.stops) || 1
      }));
  }, [apiFlights]);

  const maxPossiblePrice = Math.max(...rawDisplayFlights.map(f => f.price));
  const minPossiblePrice = Math.min(...rawDisplayFlights.map(f => f.price));
  const availableAirlines = Array.from(new Set(rawDisplayFlights.map(f => f.airline)));

  // Filter States
  const [maxPrice, setMaxPrice] = useState(maxPossiblePrice);
  const [maxStops, setMaxStops] = useState<number | null>(null); // null means Any
  const [selectedAirline, setSelectedAirline] = useState<string | null>(null); // null means Any

  let displayFlights = rawDisplayFlights.filter(f => {
    if (f.price > maxPrice) return false;
    if (maxStops !== null && f.stopsCount > maxStops) return false;
    if (selectedAirline && f.airline !== selectedAirline) return false;
    return true;
  });

  if (sortBy === 'Cheapest') {
    displayFlights.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Fastest') {
    const parseDuration = (d: string) => {
      if (d === 'N/A') return 999999;
      const hMatch = d.match(/(\d+)h/);
      const mMatch = d.match(/(\d+)m/);
      const h = hMatch ? parseInt(hMatch[1], 10) : 0;
      const m = mMatch ? parseInt(mMatch[1], 10) : 0;
      return h * 60 + m;
    };
    displayFlights.sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
  } else if (sortBy === 'Best rated') {
    displayFlights.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'Non-stop') {
    displayFlights = displayFlights.filter(f => f.stopsCount === 0);
    displayFlights.sort((a, b) => a.price - b.price);
  }

  // Format date correctly
  const displayDate = searchState?.departDate
    ? new Date(searchState.departDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'May 15, 2026';

  return (
    <div className="min-h-screen pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 px-4 pt-12 pb-3 bg-[#F0F4F8]/95 backdrop-blur-sm border-b border-[#001F3F]/5">
        {/* Back + route */}
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
              {displayDate} · {searchState?.passengers || 2} passenger{searchState?.passengers !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="px-3 py-1 rounded-xl bg-[#00A854]/10 border border-[#00A854]/20 shadow-sm">
            <span className="text-xs font-black text-[#00A854]">{displayFlights.length} found</span>
          </div>
        </div>

        {/* Sort / Filter bar */}
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
                    ? 'bg-gradient-to-r from-[#0047AB] to-[#00F5FF] text-white border-transparent'
                    : 'bg-white border-[#001F3F]/10 text-[#001F3F]/60'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Panel Dropdown */}
      {showFilters && (
        <div className="px-4 py-3 bg-white border-b border-[#001F3F]/5 animate-slide-up relative z-20 shadow-sm">
          <div className="flex justify-between items-center mb-4">
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

          <div className="space-y-4">
            {/* Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-[#001F3F]/60">Max Price</span>
                <span className="text-sm font-black text-[#00A854]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range" 
                min={minPossiblePrice} 
                max={maxPossiblePrice} 
                step={100}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#00A854]" 
              />
            </div>

            {/* Stops */}
            <div>
              <span className="text-xs font-bold text-[#001F3F]/60 mb-2 block">Stops</span>
              <div className="flex gap-2">
                {[
                  { label: 'Any', value: null },
                  { label: 'Direct', value: 0 },
                  { label: '1 Stop', value: 1 }
                ].map(stopOpt => (
                  <button 
                    key={stopOpt.label}
                    onClick={() => setMaxStops(stopOpt.value)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      maxStops === stopOpt.value 
                        ? 'bg-[#0047AB]/10 border-[#0047AB] text-[#0047AB]' 
                        : 'bg-transparent border-[#001F3F]/10 text-[#001F3F]/50 hover:bg-[#001F3F]/5'
                    }`}
                  >
                    {stopOpt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Airlines */}
            <div>
              <span className="text-xs font-bold text-[#001F3F]/60 mb-2 block">Airlines</span>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedAirline(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    selectedAirline === null 
                      ? 'bg-[#0047AB]/10 border-[#0047AB] text-[#0047AB]' 
                      : 'bg-transparent border-[#001F3F]/10 text-[#001F3F]/50'
                  }`}
                >
                  All Airlines
                </button>
                {availableAirlines.map(airline => (
                  <button 
                    key={airline}
                    onClick={() => setSelectedAirline(airline)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      selectedAirline === airline 
                        ? 'bg-[#0047AB]/10 border-[#0047AB] text-[#0047AB]' 
                        : 'bg-transparent border-[#001F3F]/10 text-[#001F3F]/50'
                    }`}
                  >
                    {airline}
                  </button>
                ))}
              </div>
            </div>

            <PremiumButton variant="primary" className="w-full mt-2" onClick={() => setShowFilters(false)}>
              Show {displayFlights.length} Flights
            </PremiumButton>
          </div>
        </div>
      )}

      {/* Flight list */}
      <div className="px-4 pt-4 pb-8 space-y-3">
        {displayFlights.length > 0 ? (
          <>
            {displayFlights.slice(0, visibleCount).map((flight) => (
              <EnhancedFlightCard
                key={flight.id}
                {...flight}
                onBook={() => {
                  alert(`Redirecting you to complete your booking with ${flight.airline}...`);
                }}
              />
            ))}

            {visibleCount < displayFlights.length && (
              <PremiumButton
                variant="glass"
                className="w-full mt-4"
                onClick={() => setVisibleCount(v => v + 5)}
              >
                Load More Flights
              </PremiumButton>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[#001F3F]/5 flex items-center justify-center mx-auto mb-3">
              <Filter size={24} className="text-[#001F3F]/30" />
            </div>
            <h3 className="text-lg font-black text-[#001F3F]">No flights match your filters</h3>
            <p className="text-sm text-[#001F3F]/50 font-medium mt-1">Try adjusting the price, stops, or airlines.</p>
            <button 
              onClick={() => {
                setMaxPrice(maxPossiblePrice);
                setMaxStops(null);
                setSelectedAirline(null);
                setShowFilters(false);
              }}
              className="mt-4 px-4 py-2 bg-[#0047AB] text-white rounded-xl text-sm font-bold shadow-md"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
